import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, balancesTable, bankAccountsTable } from "@workspace/db/schema";
import { eq, ilike, or, and, count, SQL } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";
import { logAction } from "../lib/logger.js";

const router = Router();
router.use(requireAuth);
router.use(requireAdmin);

router.get("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 20;
    const search = req.query["search"] as string;
    const status = req.query["status"] as string;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`)
      ) as SQL);
    }
    if (status && ["pending", "active", "suspended"].includes(status)) {
      conditions.push(eq(usersTable.status, status as "pending" | "active" | "suspended"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      phone: usersTable.phone,
      country: usersTable.country,
      dateOfBirth: usersTable.dateOfBirth,
      role: usersTable.role,
      status: usersTable.status,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    }).from(usersTable).where(whereClause).limit(limit).offset(offset).orderBy(usersTable.createdAt);

    const [{ total }] = await db.select({ total: count() }).from(usersTable).where(whereClause);
    res.json({ users, total: Number(total), page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/stats", async (req: AuthRequest, res): Promise<void> => {
  res.redirect("/api/admin/stats");
});

router.get("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [user] = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      phone: usersTable.phone,
      country: usersTable.country,
      dateOfBirth: usersTable.dateOfBirth,
      role: usersTable.role,
      status: usersTable.status,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    }).from(usersTable).where(eq(usersTable.id, id)).limit(1);

    if (!user) { res.status(404).json({ error: "Not Found" }); return; }

    const [balance] = await db.select().from(balancesTable).where(eq(balancesTable.userId, id)).limit(1);
    const accounts = await db.select().from(bankAccountsTable).where(eq(bankAccountsTable.userId, id));

    res.json({
      ...user,
      balances: balance ? { eur: parseFloat(balance.eur), usd: parseFloat(balance.usd), btc: parseFloat(balance.btc) } : { eur: 0, usd: 0, btc: 0 },
      bankAccounts: accounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const { firstName, lastName, phone, country, status, role } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (firstName !== undefined) updates["firstName"] = firstName;
    if (lastName !== undefined) updates["lastName"] = lastName;
    if (phone !== undefined) updates["phone"] = phone;
    if (country !== undefined) updates["country"] = country;
    if (status !== undefined) updates["status"] = status;
    if (role !== undefined) updates["role"] = role;

    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning({
      id: usersTable.id, email: usersTable.email, firstName: usersTable.firstName,
      lastName: usersTable.lastName, role: usersTable.role, status: usersTable.status,
      createdAt: usersTable.createdAt, updatedAt: usersTable.updatedAt,
    });
    if (!updated) { res.status(404).json({ error: "Not Found" }); return; }
    await logAction({ adminId: req.userId, action: "UPDATE_USER", target: "user", targetId: id });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    await db.delete(usersTable).where(eq(usersTable.id, id));
    await logAction({ adminId: req.userId, action: "DELETE_USER", target: "user", targetId: id });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/activate", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    await db.update(usersTable).set({ status: "active", updatedAt: new Date() }).where(eq(usersTable.id, id));
    await logAction({ adminId: req.userId, action: "ACTIVATE_USER", target: "user", targetId: id });
    res.json({ success: true, message: "User activated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/suspend", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    await db.update(usersTable).set({ status: "suspended", updatedAt: new Date() }).where(eq(usersTable.id, id));
    await logAction({ adminId: req.userId, action: "SUSPEND_USER", target: "user", targetId: id });
    res.json({ success: true, message: "User suspended" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
