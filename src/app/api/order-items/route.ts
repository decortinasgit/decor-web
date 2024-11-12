import { z } from "zod"
import { addOrderItems } from "@/lib/actions/orders"

export async function POST(req: Request) {
  try {
    const ordersData = await req.json()

    await addOrderItems(ordersData)

    return new Response("Orders added successfully", { status: 201 })
  } catch (error) {
    console.error(error)

    // Validación de Zod
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    // Errores genéricos
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response("Something went wrong", { status: 500 })
  }
}
