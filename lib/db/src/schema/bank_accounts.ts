import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const bankAccountsTable = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  beneficiaryName: text("beneficiary_name").notNull(),
  iban: text("iban").notNull(),
  bic: text("bic"),
  bankName: text("bank_name"),
  country: text("country"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBankAccountSchema = createInsertSchema(bankAccountsTable).omit({ id: true, createdAt: true });
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type BankAccount = typeof bankAccountsTable.$inferSelect;
