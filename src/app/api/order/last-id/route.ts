import { z } from "zod";
import { getLastOrderId } from "@/lib/actions/orders";

export async function GET(req: Request) {
  try {
    const lastOrderId = await getLastOrderId();

    if (!lastOrderId) {
      return new Response("Last Order Id not found", { status: 404 });
    }

    return new Response(JSON.stringify(lastOrderId), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    // Validación de Zod
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    // Errores genéricos
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
