import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const systemLogsTable = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => usersTable.id),
  action: text("action").notNull(),
  target: text("target"),
  targetId: integer("target_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogsTable).omit({ id: true, createdAt: true });
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogsTable.$inferSelect;
