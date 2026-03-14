import { pgTable, serial, integer, numeric, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { transactionsTable } from "./transactions";

export const bankTransferCurrencyEnum = pgEnum("bank_transfer_currency", ["EUR", "USD"]);
export const bankTransferStatusEnum = pgEnum("bank_transfer_status", ["pending", "processing", "completed", "rejected"]);

export const bankTransfersTable = pgTable("bank_transfers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: bankTransferCurrencyEnum("currency").notNull(),
  beneficiaryName: text("beneficiary_name").notNull(),
  iban: text("iban").notNull(),
  bic: text("bic"),
  bankName: text("bank_name"),
  reference: text("reference"),
  status: bankTransferStatusEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  transactionId: integer("transaction_id").references(() => transactionsTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBankTransferSchema = createInsertSchema(bankTransfersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBankTransfer = z.infer<typeof insertBankTransferSchema>;
export type BankTransfer = typeof bankTransfersTable.$inferSelect;
