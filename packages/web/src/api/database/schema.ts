import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  address: text("address", { mode: "json" }).notNull().$type<{
    line1: string;
    city: string;
    postcode: string;
    country: string;
  }>(),
  items: text("items", { mode: "json" }).notNull().$type<
    { productId: string; name: string; size: number; qty: number; price: number }[]
  >(),
  subtotal: real("subtotal").notNull(),
  shipping: real("shipping").notNull(),
  total: real("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
