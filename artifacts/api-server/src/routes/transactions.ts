import { Router } from "express";
import { db } from "@workspace/db";
import { transactionsTable, usersTable } from "@workspace/db/schema";
import { eq, and, desc, count, SQL } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";
import { logAction } from "../lib/logger.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 20;
    const status = req.query["status"] as string;
    const type = req.query["type"] as string;
    const offset = (page - 1) * limit;

    const isAdmin = req.userRole === "admin";
    const conditions: SQL[] = [];
    if (!isAdmin) conditions.push(eq(transactionsTable.userId, req.userId!));
    if (status && ["pending","processing","completed","rejected"].includes(status)) {
      conditions.push(eq(transactionsTable.status, status as "pending"|"processing"|"completed"|"rejected"));
    }
    if (type && ["bank_transfer","crypto_transfer","credit","debit"].includes(type)) {
      conditions.push(eq(transactionsTable.type, type as "bank_transfer"|"crypto_transfer"|"credit"|"debit"));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const txs = await db
      .select({
        id: transactionsTable.id,
        userId: transactionsTable.userId,
        type: transactionsTable.type,
        amount: transactionsTable.amount,
        currency: transactionsTable.currency,
        status: transactionsTable.status,
        description: transactionsTable.description,
        rejectionReason: transactionsTable.rejectionReason,
        createdAt: transactionsTable.createdAt,
        updatedAt: transactionsTable.updatedAt,
        userFirstName: usersTable.firstName,
        userLastName: usersTable.lastName,
        userEmail: usersTable.email,
      })
      .from(transactionsTable)
      .leftJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(transactionsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(transactionsTable).where(whereClause);

    const transactions = txs.map(tx => ({
      id: tx.id,
      userId: tx.userId,
      type: tx.type,
      amount: parseFloat(tx.amount),
      currency: tx.currency,
      status: tx.status,
      description: tx.description,
      rejectionReason: tx.rejectionReason,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
      user: { firstName: tx.userFirstName, lastName: tx.userLastName, email: tx.userEmail },
    }));
    res.json({ transactions, total: Number(total), page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id)).limit(1);
    if (!tx) { res.status(404).json({ error: "Not Found" }); return; }
    if (req.userRole !== "admin" && tx.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    res.json({ ...tx, amount: parseFloat(tx.amount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/validate", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    await db.update(transactionsTable).set({ status: "completed", updatedAt: new Date() }).where(eq(transactionsTable.id, id));
    await logAction({ adminId: req.userId, action: "VALIDATE_TRANSACTION", target: "transaction", targetId: id });
    res.json({ success: true, message: "Transaction validated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/reject", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const { reason } = req.body;
    await db.update(transactionsTable).set({ status: "rejected", rejectionReason: reason || null, updatedAt: new Date() }).where(eq(transactionsTable.id, id));
    await logAction({ adminId: req.userId, action: "REJECT_TRANSACTION", target: "transaction", targetId: id });
    res.json({ success: true, message: "Transaction rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
