import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, balancesTable, transactionsTable, bankTransfersTable, cryptoTransfersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { signToken, signTempToken, verifyTempToken } from "../lib/jwt.js";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import { verifyTwoFactorCode } from "./two_factor.js";

const router = Router();

router.post("/register", async (req, res): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, country, dateOfBirth } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing) {
      res.status(400).json({ error: "Bad Request", message: "Email already registered" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null,
      country: country || null,
      dateOfBirth: dateOfBirth || null,
      role: "user",
      status: "pending",
    }).returning();
    await db.insert(balancesTable).values({ userId: user.id, eur: "0", usd: "0", btc: "0" });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ token, user: { ...safeUser, role: user.role, status: user.status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
  }
});

router.post("/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Bad Request", message: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }

    if (user.twoFactorEnabled) {
      const tempToken = signTempToken({ userId: user.id, twoFactorPending: true });
      res.json({ requiresTwoFactor: true, tempToken });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, twoFactorSecret: __, twoFactorPendingSecret: ___, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: "Login failed" });
  }
});

router.post("/login/2fa", async (req, res): Promise<void> => {
  try {
    const { tempToken, code } = req.body || {};
    if (!tempToken || !code) {
      res.status(400).json({ error: "Token et code requis" });
      return;
    }

    let payload: { userId: number; twoFactorPending: boolean };
    try {
      payload = verifyTempToken(tempToken) as { userId: number; twoFactorPending: boolean };
    } catch {
      res.status(401).json({ error: "Token expiré ou invalide. Veuillez vous reconnecter." });
      return;
    }

    if (!payload.twoFactorPending) {
      res.status(400).json({ error: "Token invalide" });
      return;
    }

    const validCode = await verifyTwoFactorCode(payload.userId, code);
    if (!validCode) {
      res.status(401).json({ error: "Code d'authentification invalide" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, twoFactorSecret: __, twoFactorPendingSecret: ___, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(404).json({ error: "Not Found", message: "User not found" });
      return;
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { firstName, lastName, phone, country, dateOfBirth } = req.body || {};
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (firstName !== undefined) updates["firstName"] = firstName;
    if (lastName !== undefined) updates["lastName"] = lastName;
    if (phone !== undefined) updates["phone"] = phone;
    if (country !== undefined) updates["country"] = country;
    if (dateOfBirth !== undefined) updates["dateOfBirth"] = dateOfBirth;

    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
    if (!updated) { res.status(404).json({ error: "Not Found" }); return; }
    const { passwordHash: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/me/avatar", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { avatarUrl } = req.body || {};
    if (!avatarUrl) { res.status(400).json({ error: "avatarUrl is required" }); return; }
    if (typeof avatarUrl !== "string" || avatarUrl.length > 2_000_000) {
      res.status(400).json({ error: "Image trop lourde (max 1.5 MB)" }); return;
    }
    const [updated] = await db.update(usersTable).set({ avatarUrl, updatedAt: new Date() }).where(eq(usersTable.id, req.userId!)).returning();
    if (!updated) { res.status(404).json({ error: "Not Found" }); return; }
    const { passwordHash: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/me/password", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Bad Request", message: "Current and new password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Not Found" }); return; }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Unauthorized", message: "Mot de passe actuel incorrect" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "Bad Request", message: "Le nouveau mot de passe doit contenir au moins 8 caractères" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.update(usersTable).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(usersTable.id, req.userId!));
    res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/export", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = req.userId!;
    const [user] = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      phone: usersTable.phone,
      country: usersTable.country,
      dateOfBirth: usersTable.dateOfBirth,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!user) { res.status(404).json({ error: "Not Found" }); return; }

    const [balance] = await db.select().from(balancesTable).where(eq(balancesTable.userId, id)).limit(1);
    const transactions = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, id)).orderBy(desc(transactionsTable.createdAt));
    const bankTransfers = await db.select().from(bankTransfersTable).where(eq(bankTransfersTable.userId, id)).orderBy(desc(bankTransfersTable.createdAt));
    const cryptoTransfers = await db.select().from(cryptoTransfersTable).where(eq(cryptoTransfersTable.userId, id)).orderBy(desc(cryptoTransfersTable.createdAt));

    res.json({
      user,
      balances: balance ? { eur: parseFloat(balance.eur), usd: parseFloat(balance.usd), btc: parseFloat(balance.btc) } : { eur: 0, usd: 0, btc: 0 },
      transactions,
      bankTransfers,
      cryptoTransfers,
      exportedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
