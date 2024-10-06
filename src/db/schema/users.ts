import { pgTable, text, boolean } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  phone: text("phone").notNull(),
  businessName: text("business_name").notNull(),
  cuitOrDni: text("cuit_or_dni").notNull(),
  province: text("province").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
  preferredTransport: text("preferred_transport").notNull(),
  password: text("password").notNull(),
  ...lifecycleDates,
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
