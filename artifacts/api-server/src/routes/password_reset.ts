import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@workspace/db";
import { usersTable, passwordResetTokensTable } from "@workspace/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { sendPasswordResetEmail } from "../lib/email.js";

const router = Router();

router.post("/forgot-password", async (req, res): Promise<void> => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Email requis" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) {
      res.json({ message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(passwordResetTokensTable).values({ userId: user.id, token, expiresAt });

    await sendPasswordResetEmail(user.email, user.firstName, token);

    res.json({ message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/reset-password/validate", async (req, res): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).json({ valid: false, error: "Token manquant" });
      return;
    }

    const [record] = await db
      .select({ id: passwordResetTokensTable.id, expiresAt: passwordResetTokensTable.expiresAt, usedAt: passwordResetTokensTable.usedAt })
      .from(passwordResetTokensTable)
      .where(and(eq(passwordResetTokensTable.token, token), isNull(passwordResetTokensTable.usedAt), gt(passwordResetTokensTable.expiresAt, new Date())))
      .limit(1);

    if (!record) {
      res.status(400).json({ valid: false, error: "Lien invalide ou expiré" });
      return;
    }

    res.json({ valid: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res): Promise<void> => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      res.status(400).json({ error: "Token et nouveau mot de passe requis" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
      return;
    }

    const [record] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(and(eq(passwordResetTokensTable.token, token), isNull(passwordResetTokensTable.usedAt), gt(passwordResetTokensTable.expiresAt, new Date())))
      .limit(1);

    if (!record) {
      res.status(400).json({ error: "Lien invalide ou expiré. Veuillez refaire une demande." });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(usersTable).set({ passwordHash, updatedAt: new Date() }).where(eq(usersTable.id, record.userId));
    await db.update(passwordResetTokensTable).set({ usedAt: new Date() }).where(eq(passwordResetTokensTable.id, record.id));

    res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
