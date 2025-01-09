import { z } from "zod";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { orders, orderItems, OrderItem, OrderStatus } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  orderItemSchema,
  orderSchema,
  orderStatusSchema,
} from "../validations/orders";
import { OrderStats } from "@/types/orders";

export async function addOrder(rawInput: z.infer<typeof orderSchema>) {
  try {
    const order = await db
      .insert(orders)
      .values({
        id: rawInput.id,
        company: rawInput.company,
        client: rawInput.client,
        email: rawInput.email,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: orders.id, email: orders.email });

    return {
      data: order,
      error: null,
    };
  } catch (err) {
    console.error("Error adding order:", err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function addOrderItems(
  rawItems: z.infer<typeof orderItemSchema>[]
) {
  try {
    const insertedItems = await db.insert(orderItems).values(
      rawItems.map((item) => ({
        accessories: item.accessories,
        category: item.category,
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
    );

    return {
      data: insertedItems,
      error: null,
    };
  } catch (err) {
    console.error("Error adding order items:", err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function addOrderWithItems(
  rawOrderInput: z.infer<typeof orderSchema>,
  rawItemsInput: z.infer<typeof orderItemSchema>[]
) {
  try {
    const result = await db.transaction(async (trx) => {
      // Crear la orden
      const [order] = await trx
        .insert(orders)
        .values({
          id: rawOrderInput.id,
          company: rawOrderInput.company,
          client: rawOrderInput.client,
          email: rawOrderInput.email,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: orders.id });

      if (!order || !order.id) {
        throw new Error("Failed to create order: No ID returned");
      }

      // Crear los ítems de la orden
      const insertedItems = await trx.insert(orderItems).values(
        rawItemsInput.map((item) => ({
          accessories: item.accessories,
          category: item.category,
          orderId: order.id, // Asociar con la ID de la orden creada
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
      );

      return {
        order,
        insertedItems,
      };
    });

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    console.error("Error adding order with items:", err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function getOrders({
  page = 1,
  limit = 10,
  email,
}: {
  page?: number;
  limit?: number;
  email?: string; // Nuevo parámetro para filtrar por email
} = {}) {
  noStore();

  try {
    const transaction = await db.transaction(async (tx) => {
      // Crear consulta base con filtro por email (si aplica)
      let baseQuery = tx
        .select({
          orderId: orders.id,
          company: orders.company,
          client: orders.client,
          email: orders.email,
          status: orders.status,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          items: sql`JSON_AGG(${orderItems})`.as("items"),
        })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId));

      // Aplicar filtro por email antes del groupBy
      if (email) {
        // @ts-ignore
        baseQuery = baseQuery.where(eq(orders.email, email));
      }

      // Aplicar agrupación, límite y desplazamiento
      const ordersWithItems = await baseQuery
        .groupBy(orders.id)
        .limit(limit)
        .offset((page - 1) * limit);

      const totalQuery = tx
        .select({
          count: sql`COUNT(${orders.id})`,
        })
        .from(orders);

      // Aplicar filtro por email al total también
      if (email) {
        totalQuery.where(eq(orders.email, email));
      }

      const total = await totalQuery
        .execute()
        .then((res) => Number(res[0]?.count ?? 0));

      const pageCount = Math.ceil((total as number) / limit);

      return {
        data: ordersWithItems.map((order) => ({
          id: order.orderId,
          company: order.company,
          client: order.client,
          email: order.email,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: (order.items as OrderItem[]) || [],
        })),
        total,
        pageCount,
      };
    });

    return transaction;
  } catch (err) {
    console.error("Error fetching orders:", err);
    return {
      data: [],
      pageCount: 0,
      total: 0,
      error: err,
    };
  }
}

export async function updateOrder(rawInput: z.infer<typeof orderSchema>) {
  try {
    const result = await db
      .update(orders)
      .set({
        company: rawInput.company,
        client: rawInput.client,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, rawInput.id));

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    console.error("Error updating order:", err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function updateOrderItems(
  rawItems: z.infer<typeof orderItemSchema>[]
) {
  try {
    // Primero elimina ítems que no estén en el nuevo listado
    const itemIds = rawItems.map((item) => item.id).filter(Boolean);
    await db
      .delete(orderItems)
      .where(sql`${orderItems.id} NOT IN (${sql.join(itemIds)})`);

    // Luego inserta o actualiza ítems existentes
    for (const item of rawItems) {
      if (item.id) {
        // Actualiza ítem existente
        await db
          .update(orderItems)
          .set({
            accessories: item.accessories,
            category: item.category,
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
            updatedAt: new Date(),
          })
          .where(eq(orderItems.id, item.id));
      } else {
        // Inserta nuevo ítem
        await db.insert(orderItems).values({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return {
      data: "Items updated successfully",
      error: null,
    };
  } catch (err) {
    console.error("Error updating order items:", err);
    return {
      data: null,
      error: err,
    };
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
      .then((res) => res[0] || null); // Si no se encuentra, devolver null

    if (!order) {
      return {
        data: null,
        error: `Order with ID ${orderId} not found.`,
      };
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .execute();

    return {
      data: {
        ...order,
        items,
      },
      error: null,
    };
  } catch (err) {
    console.error(`Error fetching order with ID ${orderId}:`, err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  try {
    orderStatusSchema.parse(newStatus);

    const result = await db
      .update(orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (result.length === 0) {
      return {
        data: null,
        error: `Order with ID ${orderId} not found.`,
      };
    }

    return {
      data: result[0],
      error: null,
    };
  } catch (err: any) {
    console.error(`Error updating order status for ID ${orderId}:`, err);
    return {
      data: null,
      error: err instanceof z.ZodError ? err.errors : err.message,
    };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));

    const result = await db.delete(orders).where(eq(orders.id, orderId));

    if (!result) {
      return {
        data: null,
        error: `Order with ID ${orderId} not found.`,
      };
    }

    return {
      data: `Order with ID ${orderId} deleted successfully`,
      error: null,
    };
  } catch (err) {
    console.error(`Error deleting order with ID ${orderId}:`, err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function getOrderStatistics(): Promise<{
  data: OrderStats | null;
  error: any;
}> {
  try {
    const stats = await db.transaction(async (tx) => {
      // Cantidad de órdenes en status "completed"
      const completedOrdersCount = await tx
        .select({
          count: sql`COUNT(${orders.id})`.as("count"),
        })
        .from(orders)
        .where(eq(orders.status, "completed"))
        .then((res) => Number(res[0]?.count ?? 0));

      // Cantidad total de órdenes
      const totalOrdersCount = await tx
        .select({
          count: sql`COUNT(${orders.id})`.as("count"),
        })
        .from(orders)
        .then((res) => Number(res[0]?.count ?? 0));

      // Suma total de price de los items en las órdenes "completed"
      const totalPriceCompletedOrders = await tx
        .select({
          totalPrice:
            sql`COALESCE(SUM(CAST(${orderItems.price} AS numeric) * ${orderItems.qty}), 0)`.as(
              "totalPrice"
            ),
        })
        .from(orderItems)
        .leftJoin(orders, eq(orderItems.orderId, orders.id))
        .where(eq(orders.status, "completed"))
        .then((res) => Number(res[0]?.totalPrice ?? 0));

      // Cantidad de órdenes en status "pending"
      const pendingOrdersCount = await tx
        .select({
          count: sql`COUNT(${orders.id})`.as("count"),
        })
        .from(orders)
        .where(eq(orders.status, "pending"))
        .then((res) => Number(res[0]?.count ?? 0));

      return {
        completedOrdersCount,
        totalOrdersCount,
        totalPriceCompletedOrders,
        pendingOrdersCount,
      };
    });

    return {
      data: stats,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching order statistics:", err);
    return {
      data: null,
      error: err,
    };
  }
}
