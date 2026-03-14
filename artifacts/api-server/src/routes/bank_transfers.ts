import { Router } from "express";
import { db } from "@workspace/db";
import { bankTransfersTable, transactionsTable, usersTable } from "@workspace/db/schema";
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
    const offset = (page - 1) * limit;
    const isAdmin = req.userRole === "admin";

    const conditions: SQL[] = [];
    if (!isAdmin) conditions.push(eq(bankTransfersTable.userId, req.userId!));
    if (status && ["pending","processing","completed","rejected"].includes(status)) {
      conditions.push(eq(bankTransfersTable.status, status as "pending"|"processing"|"completed"|"rejected"));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: bankTransfersTable.id,
        userId: bankTransfersTable.userId,
        amount: bankTransfersTable.amount,
        currency: bankTransfersTable.currency,
        beneficiaryName: bankTransfersTable.beneficiaryName,
        iban: bankTransfersTable.iban,
        bic: bankTransfersTable.bic,
        bankName: bankTransfersTable.bankName,
        reference: bankTransfersTable.reference,
        status: bankTransfersTable.status,
        rejectionReason: bankTransfersTable.rejectionReason,
        transactionId: bankTransfersTable.transactionId,
        createdAt: bankTransfersTable.createdAt,
        updatedAt: bankTransfersTable.updatedAt,
        userFirstName: usersTable.firstName,
        userLastName: usersTable.lastName,
        userEmail: usersTable.email,
      })
      .from(bankTransfersTable)
      .leftJoin(usersTable, eq(bankTransfersTable.userId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(bankTransfersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(bankTransfersTable).where(whereClause);
    const transfers = rows.map(r => ({
      ...r,
      amount: parseFloat(r.amount),
      user: { firstName: r.userFirstName, lastName: r.userLastName, email: r.userEmail },
    }));
    res.json({ transfers, total: Number(total), page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { amount, currency, beneficiaryName, iban, bic, bankName, reference } = req.body;
    if (!amount || !currency || !beneficiaryName || !iban) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const [tx] = await db.insert(transactionsTable).values({
      userId: req.userId!,
      type: "bank_transfer",
      amount: String(amount),
      currency: currency,
      status: "pending",
      description: `Virement bancaire vers ${beneficiaryName}`,
    }).returning();

    const [transfer] = await db.insert(bankTransfersTable).values({
      userId: req.userId!,
      amount: String(amount),
      currency,
      beneficiaryName,
      iban,
      bic: bic || null,
      bankName: bankName || null,
      reference: reference || null,
      status: "pending",
      transactionId: tx.id,
    }).returning();
    res.status(201).json({ ...transfer, amount: parseFloat(transfer.amount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [transfer] = await db.select().from(bankTransfersTable).where(eq(bankTransfersTable.id, id)).limit(1);
    if (!transfer) { res.status(404).json({ error: "Not Found" }); return; }
    if (req.userRole !== "admin" && transfer.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    res.json({ ...transfer, amount: parseFloat(transfer.amount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/validate", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [transfer] = await db.update(bankTransfersTable).set({ status: "completed", updatedAt: new Date() }).where(eq(bankTransfersTable.id, id)).returning();
    if (transfer.transactionId) {
      await db.update(transactionsTable).set({ status: "completed", updatedAt: new Date() }).where(eq(transactionsTable.id, transfer.transactionId));
    }
    await logAction({ adminId: req.userId, action: "VALIDATE_BANK_TRANSFER", target: "bank_transfer", targetId: id });
    res.json({ success: true, message: "Bank transfer validated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/reject", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const { reason } = req.body;
    const [transfer] = await db.update(bankTransfersTable).set({ status: "rejected", rejectionReason: reason || null, updatedAt: new Date() }).where(eq(bankTransfersTable.id, id)).returning();
    if (transfer.transactionId) {
      await db.update(transactionsTable).set({ status: "rejected", rejectionReason: reason || null, updatedAt: new Date() }).where(eq(transactionsTable.id, transfer.transactionId));
    }
    await logAction({ adminId: req.userId, action: "REJECT_BANK_TRANSFER", target: "bank_transfer", targetId: id });
    res.json({ success: true, message: "Bank transfer rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
