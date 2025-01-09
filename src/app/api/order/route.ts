import { z } from "zod";
import {
  addOrderWithItems,
  deleteOrder,
  getOrders,
  updateOrder,
} from "@/lib/actions/orders";
import { NextResponse } from "next/server";
import { getUserWithAttributes } from "@/lib/queries/user";
import { sendEmail } from "@/lib/email";
import { orderItemSchema, orderSchema } from "@/lib/validations/orders";

export async function POST(req: Request) {
  try {
    const { orderData, orderItemsData } = await req.json();

    console.log(orderData, "orderData");
    console.log(orderItemsData, "orderItemsData");

    // Validar datos de entrada
    const parsedOrder = orderSchema.parse(orderData);
    const parsedItems = z.array(orderItemSchema).parse(orderItemsData);

    const result = await addOrderWithItems(parsedOrder, parsedItems);

    if (!result.data) {
      throw new Error("Failed to create order with items");
    } else {
      const emailResponse = await sendEmail({
        to: parsedOrder.email,
        subject: "Orden confirmada!",
        text: `Gracias por tu orden! ID: ${parsedOrder.id}`,
        html: `<p>Gracias por tu orden! ID: <strong>${parsedOrder.id}</strong></p>`,
      });

      if (!emailResponse.success) {
        console.error(
          "Failed to send confirmation email:",
          emailResponse.error
        );
      }
    }

    return new Response(JSON.stringify(result.data), { status: 201 });
  } catch (error) {
    console.error("Error in /api/order:", error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const orderData = await req.json();
    const result = await updateOrder(orderData);

    if (result.error) {
      throw result.error;
    }

    return new Response(JSON.stringify(result.data), { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserWithAttributes();
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const id = url.searchParams.get("id") || undefined;

    const result = await getOrders({
      page,
      limit,
      email: user.roleId === "0" ? undefined : user.email,
      id,
    });

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);

    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("ID es requerido", { status: 400 });
    }

    const result = await deleteOrder(id);

    if (result.error) {
      throw result.error;
    }

    return new Response(JSON.stringify(result.data), { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
