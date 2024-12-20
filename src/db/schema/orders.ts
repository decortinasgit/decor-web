import { pgTable, text, integer, uuid, pgEnum } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"

export const orderStatus = pgEnum("order_status", [
  "pending",
  "processing",
  "production",
  "shipped",
  "delivered",
  "completed",
])

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: text("company").notNull(),
  client: text("client").notNull(),
  email: text("email").notNull(),
  status: orderStatus("status").default("pending").notNull(), // Nueva columna de estado
  ...lifecycleDates,
})

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  qty: integer("qty").notNull(),
  name: text("name").notNull(),
  type: text("type"),
  color: text("color"),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
  support: text("support"),
  fall: text("fall"),
  chain: text("chain"),
  chainSide: text("chain_side"),
  opening: text("opening"),
  pinches: text("pinches"),
  panels: text("panels"),
  price: text("price"),
  ...lifecycleDates,
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type OrderStatus = (typeof orderStatus)["enumValues"][number];