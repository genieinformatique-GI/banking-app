import { Router } from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.post("/setup", async (req: AuthRequest, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }

    if (user.twoFactorEnabled) {
      res.status(400).json({ error: "L'authentification à deux facteurs est déjà activée" });
      return;
    }

    const secretObj = speakeasy.generateSecret({
      name: `Bank of Blockchain (${user.email})`,
      issuer: "Bank of Blockchain",
      length: 20,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secretObj.otpauth_url!);

    await db.update(usersTable).set({ twoFactorPendingSecret: secretObj.base32, updatedAt: new Date() }).where(eq(usersTable.id, user.id));

    res.json({
      secret: secretObj.base32,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secretObj.base32,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/enable", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { code } = req.body || {};
    if (!code) { res.status(400).json({ error: "Code requis" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }
    if (!user.twoFactorPendingSecret) { res.status(400).json({ error: "Veuillez d'abord initialiser la configuration 2FA" }); return; }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorPendingSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      res.status(400).json({ error: "Code invalide. Vérifiez votre application d'authentification." });
      return;
    }

    await db.update(usersTable).set({
      twoFactorEnabled: true,
      twoFactorSecret: user.twoFactorPendingSecret,
      twoFactorPendingSecret: null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    res.json({ success: true, message: "Authentification à deux facteurs activée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/disable", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { password, code } = req.body || {};
    if (!password || !code) { res.status(400).json({ error: "Mot de passe et code 2FA requis" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      res.status(400).json({ error: "La 2FA n'est pas activée" }); return;
    }

    const validPw = await bcrypt.compare(password, user.passwordHash);
    if (!validPw) { res.status(401).json({ error: "Mot de passe incorrect" }); return; }

    const validCode = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!validCode) { res.status(401).json({ error: "Code 2FA invalide" }); return; }

    await db.update(usersTable).set({
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorPendingSecret: null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    res.json({ success: true, message: "Authentification à deux facteurs désactivée." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
  const [user] = await db.select({ secret: usersTable.twoFactorSecret }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user?.secret) return false;
  return speakeasy.totp.verify({ secret: user.secret, encoding: "base32", token: code, window: 1 });
}

export default router;
