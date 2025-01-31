import { z } from "zod";
import { duplicateOrder } from "@/lib/actions/orders";

export async function POST(req: Request) {
  try {
    const { orderId, newOrderId } = await req.json();

    if (!orderId) {
      return new Response("Order ID is required", { status: 400 });
    }

    const result = await duplicateOrder(orderId, newOrderId);

    if (!result.data) {
      throw new Error("Failed to duplicate order");
    }

    return new Response(JSON.stringify(result.data), { status: 201 });
  } catch (error) {
    console.error("Error in /api/duplicate-order:", error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
