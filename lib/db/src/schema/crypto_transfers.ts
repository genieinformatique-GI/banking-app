import { pgTable, serial, integer, numeric, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { transactionsTable } from "./transactions";

export const cryptocurrencyEnum = pgEnum("cryptocurrency", ["BTC", "ETH", "USDT"]);
export const cryptoTransferStatusEnum = pgEnum("crypto_transfer_status", ["pending", "processing", "completed", "rejected"]);

export const cryptoTransfersTable = pgTable("crypto_transfers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  cryptocurrency: cryptocurrencyEnum("cryptocurrency").notNull(),
  walletAddress: text("wallet_address").notNull(),
  network: text("network"),
  status: cryptoTransferStatusEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  txHash: text("tx_hash"),
  transactionId: integer("transaction_id").references(() => transactionsTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCryptoTransferSchema = createInsertSchema(cryptoTransfersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCryptoTransfer = z.infer<typeof insertCryptoTransferSchema>;
export type CryptoTransfer = typeof cryptoTransfersTable.$inferSelect;
