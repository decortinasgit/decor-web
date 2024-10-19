import { db } from "@/db"
import { costs } from "@/db/schema"

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
