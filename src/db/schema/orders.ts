import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: text("company").notNull(),
  client: text("client").notNull(),
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
  ...lifecycleDates,
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert