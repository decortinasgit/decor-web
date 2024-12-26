import { z } from "zod";
import { updateOrderStatus } from "@/lib/actions/orders";
import { orderStatusSchema } from "@/lib/validations/orders";

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
