import { db } from "@/db"
import { users } from "@/db/schema"
import { getErrorMessage } from "../handle-error"
import { z } from "zod"
import { authSchema } from "../validations/auth"

export async function addUser(rawInput: z.infer<typeof authSchema>) {
  try {
    const user = await db
      .insert(users)
      .values({
        id: rawInput.email,
        name: "Test",
        email: rawInput.email,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ insertedId: users.id })

    return {
      data: user,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

// Function to get users with pagination and limit
export async function getUsers() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(users)

      return {
        data,
      }
    })

    return transaction
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
      error: getErrorMessage(err),
    }
  }
}
