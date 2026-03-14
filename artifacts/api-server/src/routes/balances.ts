import { Router } from "express";
import { db } from "@workspace/db";
import { balancesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";
import { logAction } from "../lib/logger.js";

const router = Router();
router.use(requireAuth);

function formatBalances(b: { eur: string; usd: string; btc: string }) {
  return { eur: parseFloat(b.eur), usd: parseFloat(b.usd), btc: parseFloat(b.btc) };
}

router.get("/me", async (req: AuthRequest, res): Promise<void> => {
  try {
    const [balance] = await db.select().from(balancesTable).where(eq(balancesTable.userId, req.userId!)).limit(1);
    if (!balance) {
      res.json({ userId: req.userId, balances: { eur: 0, usd: 0, btc: 0 } });
      return;
    }
    res.json({ userId: req.userId, balances: formatBalances(balance) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = parseInt(req.params["userId"]!);
    const [balance] = await db.select().from(balancesTable).where(eq(balancesTable.userId, userId)).limit(1);
    if (!balance) {
      res.json({ userId, balances: { eur: 0, usd: 0, btc: 0 } });
      return;
    }
    res.json({ userId, balances: formatBalances(balance) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:userId", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = parseInt(req.params["userId"]!);
    const { eur, usd, btc } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (eur !== undefined) updates["eur"] = String(eur);
    if (usd !== undefined) updates["usd"] = String(usd);
    if (btc !== undefined) updates["btc"] = String(btc);

    const [existing] = await db.select().from(balancesTable).where(eq(balancesTable.userId, userId)).limit(1);
    let balance;
    if (existing) {
      [balance] = await db.update(balancesTable).set(updates).where(eq(balancesTable.userId, userId)).returning();
    } else {
      [balance] = await db.insert(balancesTable).values({ userId, eur: String(eur || 0), usd: String(usd || 0), btc: String(btc || 0) }).returning();
    }
    await logAction({ adminId: req.userId, action: "UPDATE_BALANCES", target: "user", targetId: userId });
    res.json({ userId, balances: formatBalances(balance) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
