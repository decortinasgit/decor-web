import { z } from "zod";
import { addOrder, getOrders, updateOrderStatus } from "@/lib/actions/orders";
import { orderStatusSchema } from "@/lib/validations/orders";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ordersData = await req.json();
    const result = await addOrder(ordersData);

    if (result.error) {
      throw result.error;
    }

    return new Response(JSON.stringify(result.data), { status: 201 });
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const schema = z.object({
      orderId: z.string().uuid(),
      status: orderStatusSchema,
    });

    const { orderId, status } = schema.parse(body);

    const result = await updateOrderStatus(orderId, status);

    if (result.error) {
      return new Response(result.error, { status: 404 });
    }

    return new Response(JSON.stringify(result.data), { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Validation Error", errors: error.errors }),
        {
          status: 422,
        }
      );
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const result = await getOrders({ page, limit });

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
