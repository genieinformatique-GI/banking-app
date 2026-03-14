import { Router } from "express";
import { db } from "@workspace/db";
import { bankAccountsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const accounts = await db.select().from(bankAccountsTable).where(eq(bankAccountsTable.userId, req.userId!));
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { beneficiaryName, iban, bic, bankName, country } = req.body;
    if (!beneficiaryName || !iban) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const [account] = await db.insert(bankAccountsTable).values({
      userId: req.userId!,
      beneficiaryName,
      iban,
      bic: bic || null,
      bankName: bankName || null,
      country: country || null,
    }).returning();
    res.status(201).json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    const [account] = await db.select().from(bankAccountsTable).where(eq(bankAccountsTable.id, id)).limit(1);
    if (!account) { res.status(404).json({ error: "Not Found" }); return; }
    if (account.userId !== req.userId && req.userRole !== "admin") {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    await db.delete(bankAccountsTable).where(eq(bankAccountsTable.id, id));
    res.json({ success: true, message: "Bank account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
