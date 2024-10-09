import { updateUserRole } from "@/lib/actions/user"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    console.log("====================================")
    console.log(userData)
    console.log("====================================")

    const response = await updateUserRole(userData.userId, userData.role)

    console.log("====================================")
    console.log(response)
    console.log("====================================")

    return new Response("User role updated successfully", { status: 200 })
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
