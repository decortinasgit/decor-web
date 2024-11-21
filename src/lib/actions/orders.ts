import { z } from "zod"
import { db } from "@/db"
import { orders, orderItems } from "@/db/schema"
import { eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { orderItemSchema, orderSchema } from "../validations/orders"

export async function addOrder(rawInput: z.infer<typeof orderSchema>) {
  try {
    const order = await db
      .insert(orders)
      .values({
        id: rawInput.id,
        company: rawInput.company,
        client: rawInput.client,
        email: rawInput.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ insertedId: orders.id })

    return {
      data: order,
      error: null,
    }
  } catch (err) {
    console.error("Error adding order:", err)
    return {
      data: null,
      error: err,
    }
  }
}

export async function addOrderItems(
  rawItems: z.infer<typeof orderItemSchema>[]
) {
  try {
    const insertedItems = await db.insert(orderItems).values(
      rawItems.map((item) => ({
        orderId: item.orderId,
        qty: item.qty,
        name: item.name,
        type: item.type,
        color: item.color,
        height: item.height,
        width: item.width,
        support: item.support,
        fall: item.fall,
        chain: item.chain,
        chainSide: item.chainSide,
        opening: item.opening,
        pinches: item.pinches,
        panels: item.panels,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )

    return {
      data: insertedItems,
      error: null,
    }
  } catch (err) {
    console.error("Error adding order items:", err)
    return {
      data: null,
      error: err,
    }
  }
}

export async function getOrders() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(orders)
      const total = await tx
        .select({
          count: sql`COUNT(${orders.id})`,
        })
        .from(orders)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    return transaction
  } catch (err) {
    console.error("Error fetching orders:", err)
    return {
      data: [],
      total: 0,
      error: err,
    }
  }
}

export async function deleteOrders(orderIds: string[]) {
  try {
    if (orderIds.length === 0) {
      console.log("No orders to delete.")
      return {
        data: null,
        error: null,
        deletedCount: 0,
      }
    }

    console.log("Attempting to delete the following order IDs:", orderIds)

    await db.transaction(async (trx) => {
      const result = await trx
        .delete(orders)
        .where(inArray(orders.id, orderIds))
      console.log(`${result.count} orders were deleted from the database.`)
    })

    revalidatePath(`/dashboard/orders`)

    return {
      data: null,
      error: null,
      deletedCount: orderIds.length,
    }
  } catch (err) {
    console.error("Error deleting orders:", err)
    return {
      data: null,
      error: err,
      deletedCount: 0,
    }
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1) // Asegurarnos de traer solo un resultado
      .execute()
      .then((res) => res[0] || null) // Si no se encuentra, devolver null

    if (!order) {
      return {
        data: null,
        error: `Order with ID ${orderId} not found.`,
      }
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .execute()

    return {
      data: {
        ...order,
        items,
      },
      error: null,
    }
  } catch (err) {
    console.error(`Error fetching order with ID ${orderId}:`, err)
    return {
      data: null,
      error: err,
    }
  }
}
