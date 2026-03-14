import { Router } from "express";
import { db } from "@workspace/db";
import { systemLogsTable, usersTable } from "@workspace/db/schema";
import { eq, ilike, count, desc, SQL } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 20;
    const action = req.query["action"] as string;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (action) conditions.push(ilike(systemLogsTable.action, `%${action}%`));

    const rows = await db
      .select({
        id: systemLogsTable.id,
        adminId: systemLogsTable.adminId,
        action: systemLogsTable.action,
        target: systemLogsTable.target,
        targetId: systemLogsTable.targetId,
        details: systemLogsTable.details,
        ipAddress: systemLogsTable.ipAddress,
        createdAt: systemLogsTable.createdAt,
        adminFirstName: usersTable.firstName,
        adminLastName: usersTable.lastName,
        adminEmail: usersTable.email,
      })
      .from(systemLogsTable)
      .leftJoin(usersTable, eq(systemLogsTable.adminId, usersTable.id))
      .orderBy(desc(systemLogsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(systemLogsTable);
    const logs = rows.map(r => ({
      id: r.id,
      adminId: r.adminId,
      action: r.action,
      target: r.target,
      targetId: r.targetId,
      details: r.details,
      ipAddress: r.ipAddress,
      createdAt: r.createdAt,
      admin: { firstName: r.adminFirstName, lastName: r.adminLastName, email: r.adminEmail },
    }));
    res.json({ logs, total: Number(total), page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
