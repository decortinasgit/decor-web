import { z } from "zod"
import { addUser } from "@/lib/actions/user"
import { getUserWithAttributes } from "@/lib/queries/user"

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    await addUser(userData)

    return new Response("User added successfully", { status: 201 })
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

export async function GET(req: Request) {
  try {
    // Obtenemos el usuario con atributos
    const user = await getUserWithAttributes()

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    // Retornamos el usuario en formato JSON
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
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
