import { sql } from "drizzle-orm"
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const costs = pgTable("costs", {
  id: text("id").notNull().primaryKey(),
  dolarPrice: decimal("dolar_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  making: decimal("making", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Costs = typeof costs.$inferSelect
