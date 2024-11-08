import { sql } from "drizzle-orm"
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const curtains = pgTable("curtains", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  color: text("color"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unity: text("unity"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Curtains = typeof curtains.$inferSelect
