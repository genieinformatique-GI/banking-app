import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, transactionsTable, bankTransfersTable, cryptoTransfersTable } from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/stats", async (req: AuthRequest, res): Promise<void> => {
  try {
    const [{ totalUsers }] = await db.select({ totalUsers: count() }).from(usersTable);
    const [{ activeUsers }] = await db.select({ activeUsers: count() }).from(usersTable).where(eq(usersTable.status, "active"));
    const [{ pendingUsers }] = await db.select({ pendingUsers: count() }).from(usersTable).where(eq(usersTable.status, "pending"));
    const [{ suspendedUsers }] = await db.select({ suspendedUsers: count() }).from(usersTable).where(eq(usersTable.status, "suspended"));
    const [{ totalTransactions }] = await db.select({ totalTransactions: count() }).from(transactionsTable);
    const [{ pendingTransactions }] = await db.select({ pendingTransactions: count() }).from(transactionsTable).where(eq(transactionsTable.status, "pending"));
    const [{ completedTransactions }] = await db.select({ completedTransactions: count() }).from(transactionsTable).where(eq(transactionsTable.status, "completed"));
    const [{ rejectedTransactions }] = await db.select({ rejectedTransactions: count() }).from(transactionsTable).where(eq(transactionsTable.status, "rejected"));
    const [{ totalBankTransfers }] = await db.select({ totalBankTransfers: count() }).from(bankTransfersTable);
    const [{ totalCryptoTransfers }] = await db.select({ totalCryptoTransfers: count() }).from(cryptoTransfersTable);
    const [{ pendingBankTransfers }] = await db.select({ pendingBankTransfers: count() }).from(bankTransfersTable).where(eq(bankTransfersTable.status, "pending"));
    const [{ pendingCryptoTransfers }] = await db.select({ pendingCryptoTransfers: count() }).from(cryptoTransfersTable).where(eq(cryptoTransfersTable.status, "pending"));

    res.json({
      totalUsers: Number(totalUsers),
      activeUsers: Number(activeUsers),
      pendingUsers: Number(pendingUsers),
      suspendedUsers: Number(suspendedUsers),
      totalTransactions: Number(totalTransactions),
      pendingTransactions: Number(pendingTransactions),
      completedTransactions: Number(completedTransactions),
      rejectedTransactions: Number(rejectedTransactions),
      totalBankTransfers: Number(totalBankTransfers),
      totalCryptoTransfers: Number(totalCryptoTransfers),
      pendingBankTransfers: Number(pendingBankTransfers),
      pendingCryptoTransfers: Number(pendingCryptoTransfers),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
