import { z } from "zod";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { orders, orderItems, OrderItem, OrderStatus } from "@/db/schema";
import { desc, eq, gte, lte, sql } from "drizzle-orm";
import {
  orderItemSchema,
  orderSchema,
  orderStatusSchema,
} from "../validations/orders";
import { OrderStats } from "@/types/orders";

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
          comment: rawOrderInput.comment,
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
          accessory: item.accessory,
          category: item.category,
          orderId: order.id,
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
          comment: item.comment,
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
  id,
  fromDate,
  toDate,
}: {
  page?: number;
  limit?: number;
  email?: string;
  id?: string;
  fromDate?: Date;
  toDate?: Date;
} = {}) {
  noStore();

  try {
    const transaction = await db.transaction(async (tx) => {
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

      // Filtro por email
      if (email) {
        // @ts-ignore
        baseQuery = baseQuery.where(eq(orders.email, email));
      }

      // Filtro por id
      if (id) {
        // @ts-ignore
        baseQuery = baseQuery.where(eq(orders.id, id));
      }

      // Filtro por rango de fechas
      if (fromDate) {
        //@ts-ignore
        baseQuery = baseQuery.where(gte(orders.createdAt, fromDate));
      }
      if (toDate) {
        //@ts-ignore
        baseQuery = baseQuery.where(lte(orders.createdAt, toDate));
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

      // Filtro por id en la consulta total
      if (id) {
        totalQuery.where(eq(orders.id, id));
      }

      // Filtro por rango de fechas en la consulta total
      if (fromDate) {
        totalQuery.where(gte(orders.createdAt, fromDate));
      }
      if (toDate) {
        totalQuery.where(lte(orders.createdAt, toDate));
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

export async function updateOrderWithItems(
  orderId: string,
  rawOrderInput: z.infer<typeof orderSchema>,
  rawItemsInput: z.infer<typeof orderItemSchema>[]
) {
  try {
    const result = await db.transaction(async (trx) => {
      // Verificar si la orden existe
      const existingOrder = await trx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!existingOrder.length) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      // Actualizar la información de la orden
      await trx
        .update(orders)
        .set({
          company: rawOrderInput.company,
          client: rawOrderInput.client,
          email: rawOrderInput.email,
          status: rawOrderInput.status as OrderStatus,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      // Eliminar los ítems existentes asociados a la orden
      await trx.delete(orderItems).where(eq(orderItems.orderId, orderId));

      // Insertar los nuevos ítems
      const insertedItems = await trx.insert(orderItems).values(
        rawItemsInput.map((item) => ({
          accessory: item.accessory,
          category: item.category,
          orderId: orderId, // Asociar con la ID de la orden
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
        order: {
          ...rawOrderInput,
          id: orderId,
        },
        insertedItems,
      };
    });

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    console.error("Error updating order with items:", err);
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

export async function getLastOrderId() {
  try {
    const lastOrder = await db
      .select({
        id: orders.id,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(1)
      .execute();

    if (lastOrder.length === 0) {
      return {
        data: null,
        error: "No orders found.",
      };
    }

    return {
      data: lastOrder[0].id,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching the last order ID:", err);
    return {
      data: null,
      error: err,
    };
  }
}
