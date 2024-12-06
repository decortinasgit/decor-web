import { Accesory, Category, Chain } from "@/types/curtains";
import { sql } from "drizzle-orm";
import { decimal, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const curtains = pgTable("curtains", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  color: text("color"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unity: text("unity"),
  accessories: json("accessories").$type<Accesory[]>(),
  chains: json("chains").$type<Chain[]>(),
  category: text("category").$type<Category>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
});

export type Curtains = typeof curtains.$inferSelect;
