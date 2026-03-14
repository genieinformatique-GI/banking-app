import { Router } from "express";
import { db } from "@workspace/db";
import { cryptoTransfersTable, transactionsTable, usersTable, notificationsTable } from "@workspace/db/schema";
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
    if (!isAdmin) conditions.push(eq(cryptoTransfersTable.userId, req.userId!));
    if (status && ["pending","processing","completed","rejected"].includes(status)) {
      conditions.push(eq(cryptoTransfersTable.status, status as "pending"|"processing"|"completed"|"rejected"));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: cryptoTransfersTable.id,
        userId: cryptoTransfersTable.userId,
        amount: cryptoTransfersTable.amount,
        cryptocurrency: cryptoTransfersTable.cryptocurrency,
        walletAddress: cryptoTransfersTable.walletAddress,
        network: cryptoTransfersTable.network,
        status: cryptoTransfersTable.status,
        rejectionReason: cryptoTransfersTable.rejectionReason,
        txHash: cryptoTransfersTable.txHash,
        transactionId: cryptoTransfersTable.transactionId,
        createdAt: cryptoTransfersTable.createdAt,
        updatedAt: cryptoTransfersTable.updatedAt,
        userFirstName: usersTable.firstName,
        userLastName: usersTable.lastName,
        userEmail: usersTable.email,
      })
      .from(cryptoTransfersTable)
      .leftJoin(usersTable, eq(cryptoTransfersTable.userId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(cryptoTransfersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(cryptoTransfersTable).where(whereClause);
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
    const { amount, cryptocurrency, walletAddress, network } = req.body;
    if (!amount || !cryptocurrency || !walletAddress) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const currency = cryptocurrency === "BTC" ? "BTC" : "USD";
    const [tx] = await db.insert(transactionsTable).values({
      userId: req.userId!,
      type: "crypto_transfer",
      amount: String(amount),
      currency: currency as "BTC" | "USD" | "EUR",
      status: "pending",
      description: `Transfert ${cryptocurrency} vers ${walletAddress.slice(0, 10)}...`,
    }).returning();

    const [transfer] = await db.insert(cryptoTransfersTable).values({
      userId: req.userId!,
      amount: String(amount),
      cryptocurrency,
      walletAddress,
      network: network || null,
      status: "pending",
      transactionId: tx.id,
    }).returning();
    const [user] = await db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    await db.insert(notificationsTable).values({
      userId: req.userId!,
      title: "Transfert crypto soumis",
      message: `Votre transfert de ${amount} ${cryptocurrency} vers ${walletAddress.slice(0, 12)}... est en cours de traitement.`,
      type: "info",
      isRead: false,
    });
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, "admin"));
    if (admins.length > 0) {
      await db.insert(notificationsTable).values(admins.map(a => ({
        userId: a.id,
        title: "Nouveau transfert crypto",
        message: `${user?.firstName || ""} ${user?.lastName || ""} (${user?.email || ""}) a soumis un transfert de ${amount} ${cryptocurrency} vers ${walletAddress.slice(0, 12)}.... En attente de validation.`,
        type: "info",
        isRead: false,
      })));
    }
    res.status(201).json({ ...transfer, amount: parseFloat(transfer.amount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [transfer] = await db.select().from(cryptoTransfersTable).where(eq(cryptoTransfersTable.id, id)).limit(1);
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
    const [transfer] = await db.update(cryptoTransfersTable).set({ status: "completed", updatedAt: new Date() }).where(eq(cryptoTransfersTable.id, id)).returning();
    if (transfer.transactionId) {
      await db.update(transactionsTable).set({ status: "completed", updatedAt: new Date() }).where(eq(transactionsTable.id, transfer.transactionId));
    }
    await logAction({ adminId: req.userId, action: "VALIDATE_CRYPTO_TRANSFER", target: "crypto_transfer", targetId: id });
    res.json({ success: true, message: "Crypto transfer validated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/reject", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const { reason } = req.body;
    const [transfer] = await db.update(cryptoTransfersTable).set({ status: "rejected", rejectionReason: reason || null, updatedAt: new Date() }).where(eq(cryptoTransfersTable.id, id)).returning();
    if (transfer.transactionId) {
      await db.update(transactionsTable).set({ status: "rejected", rejectionReason: reason || null, updatedAt: new Date() }).where(eq(transactionsTable.id, transfer.transactionId));
    }
    await logAction({ adminId: req.userId, action: "REJECT_CRYPTO_TRANSFER", target: "crypto_transfer", targetId: id });
    res.json({ success: true, message: "Crypto transfer rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
