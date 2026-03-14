import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const balancesTable = pgTable("balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  eur: numeric("eur", { precision: 18, scale: 8 }).notNull().default("0"),
  usd: numeric("usd", { precision: 18, scale: 8 }).notNull().default("0"),
  btc: numeric("btc", { precision: 18, scale: 8 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBalanceSchema = createInsertSchema(balancesTable).omit({ id: true, updatedAt: true });
export type InsertBalance = z.infer<typeof insertBalanceSchema>;
export type Balance = typeof balancesTable.$inferSelect;
