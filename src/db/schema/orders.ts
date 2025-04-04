import { pgTable, text, integer, pgEnum, serial, uuid } from "drizzle-orm/pg-core";
import { lifecycleDates } from "./utils";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "budgeted",
  "confirmed",
  "fabric",
  "shipped",
  "delivered",
  "completed",
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  serial: serial('serial'),
  company: text("company").notNull(),
  client: text("client").notNull(),
  email: text("email").notNull(),
  status: orderStatus("status").default("pending").notNull(),
  comment: text("comment"),
  ...lifecycleDates,
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  accessory: text("accessory"),
  category: text("category").notNull(),
  orderId: text("order_id")
    .references(() => orders.id)
    .notNull(),
  qty: integer("qty").notNull(),
  name: text("name").notNull(),
  type: text("type"),
  color: text("color"),
  height: integer("height"),
  width: integer("width"),
  support: text("support"),
  fall: text("fall"),
  chain: text("chain"),
  chainSide: text("chain_side"),
  opening: text("opening"),
  pinches: text("pinches"),
  panels: text("panels"),
  price: text("price"),
  comment: text("comment"),
  group: text("group"),
  ...lifecycleDates,
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderStatus = (typeof orderStatus)["enumValues"][number];
