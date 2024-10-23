"use server"

import { eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { costs } from "@/db/schema"
import { costsSchema } from "../validations/costs"

export async function getCosts() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(costs)

      return {
        data,
      }
    })

    return transaction
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
      error: err,
    }
  }
}

export async function updateCosts(rawInput: z.infer<typeof costsSchema>) {
  noStore()

  try {
    const input = costsSchema.parse(rawInput)

    const existingCosts = await db.query.costs.findFirst()

    if (!existingCosts) {
      throw new Error("Costs not found.")
    }

    const updatedCosts = await db
      .update(costs)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(costs.id, existingCosts.id))
      .returning()

    return {
      data: updatedCosts,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err,
    }
  }
}
