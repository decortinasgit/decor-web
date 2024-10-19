import { sql } from "drizzle-orm"
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const costs = pgTable("costs", {
  id: text("id").notNull().primaryKey(),
  dolarRollerPrice: decimal("dolar_roller_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  dolarRielPrice: decimal("dolar_riel_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  dolarEuropeanRielPrice: decimal("dolar_european_riel_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Costs = typeof costs.$inferSelect
