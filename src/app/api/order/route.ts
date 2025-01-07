import { z } from "zod";
import { addOrder, getOrders, updateOrder } from "@/lib/actions/orders";
import { NextResponse } from "next/server";
import { getUserWithAttributes } from "@/lib/queries/user";

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

    const result = await getOrders({
      page,
      limit,
      email: user.roleId === "0" ? undefined : user.email,
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
