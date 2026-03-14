import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  type: text("type").notNull().default("text"),
  label: text("label").notNull().default(""),
  page: text("page").notNull().default("general"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteContent = typeof siteContentTable.$inferSelect;
