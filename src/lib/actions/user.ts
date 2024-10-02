import { db } from "@/db"
import { users } from "@/db/schema"
import { getErrorMessage } from "../handle-error"
import { z } from "zod"
import { authSchema } from "../validations/auth"
import { eq } from "drizzle-orm"

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

export async function updateEmailVerifiedStatus(
  userId: string,
  status: boolean
) {
  try {
    const result = await db
      .update(users)
      .set({ emailVerified: status })
      .where(eq(users.email, userId))
      .returning({ updatedId: users.email })

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
