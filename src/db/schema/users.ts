import { pgTable, text, boolean } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  ...lifecycleDates,
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
