import { db } from "@workspace/db";
import { systemLogsTable } from "@workspace/db/schema";

export async function logAction(params: {
  adminId?: number;
  action: string;
  target?: string;
  targetId?: number;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await db.insert(systemLogsTable).values({
      adminId: params.adminId ?? null,
      action: params.action,
      target: params.target ?? null,
      targetId: params.targetId ?? null,
      details: params.details ?? null,
      ipAddress: params.ipAddress ?? null,
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}
