import { z } from "zod"
import { addOrder } from "@/lib/actions/orders"

export async function POST(req: Request) {
  try {
    const ordersData = await req.json()
    const result = await addOrder(ordersData)

    if (result.error) {
      throw result.error
    }


    return new Response(JSON.stringify(result.data), { status: 201 })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response("Something went wrong", { status: 500 })
  }
}
