import { updateEmailVerifiedStatus } from "@/lib/actions/user"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    await updateEmailVerifiedStatus(userData.email, userData.email_verified)
    return new Response("User updated succesfully", { status: 201 })
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
