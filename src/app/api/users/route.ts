import { z } from "zod"
import { addUser } from "@/lib/actions/user"

export async function POST(req: Request) {
  try {
    const userData = await req.json()
    console.log("Datos recibidos:", userData.data)

    await addUser(userData.data)
    return new Response("User added successfully", { status: 201 })
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
