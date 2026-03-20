import { Router } from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, notificationsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const router = Router();
router.use(requireAuth);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPToUser(user: { id: number; email: string; phone: string | null }, method: string, code: string): Promise<void> {
  if (method === "email") {
    try {
      await resend.emails.send({
        from: "Bank of Blockchain <noreply@blockchainbankapp.com>",
        to: user.email,
        subject: "Votre code de vérification 2FA",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
            <h2>Code de vérification</h2>
            <p>Votre code de vérification 2FA est :</p>
            <h1 style="letter-spacing: 8px; color: #4F46E5;">${code}</h1>
            <p>Ce code est valable <strong>10 minutes</strong>. Ne le partagez avec personne.</p>
          </div>
        `,
      });
      console.log(`[2FA EMAIL] Envoyé à ${user.email}`);
    } catch (err) {
      console.error(`[2FA EMAIL ERROR]`, err);
      throw err;
    }

    try {
      await db.insert(notificationsTable).values({
        userId: user.id,
        title: "Code de vérification 2FA",
        message: `Votre code de vérification a été envoyé à ${user.email} (valable 10 minutes).`,
        type: "info",
        isRead: false,
      });
    } catch {}

  } else if (method === "sms") {
    const phone = user.phone || "numéro non renseigné";
    console.log(`[2FA SMS] To: ${phone} — Code: ${code}`);
    try {
      await db.insert(notificationsTable).values({
        userId: user.id,
        title: "Code 2FA par SMS",
        message: `Votre code de vérification 2FA est : ${code} (valable 10 minutes).`,
        type: "info",
        isRead: false,
      });
    } catch {}
  }
}

router.post("/setup", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { method } = req.body || {};
    if (!method || !["app", "email", "sms"].includes(method)) {
      res.status(400).json({ error: "Méthode invalide. Choisissez : app, email ou sms" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }

    if (method === "app") {
      const secretObj = speakeasy.generateSecret({
        name: `Bank of Blockchain (${user.email})`,
        issuer: "Bank of Blockchain",
        length: 20,
      });
      const qrCodeDataUrl = await QRCode.toDataURL(secretObj.otpauth_url!);
      await db.update(usersTable).set({
        twoFactorPendingSecret: secretObj.base32,
        twoFactorMethod: "app",
        updatedAt: new Date(),
      }).where(eq(usersTable.id, user.id));

      res.json({
        method: "app",
        secret: secretObj.base32,
        qrCode: qrCodeDataUrl,
        manualEntryKey: secretObj.base32,
        email: user.email,
      });
    } else {
      const code = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await db.update(usersTable).set({
        otpCode: code,
        otpExpiry,
        twoFactorMethod: method,
        twoFactorSecret: null,
        twoFactorPendingSecret: null,
        updatedAt: new Date(),
      }).where(eq(usersTable.id, user.id));

      await sendOTPToUser(user, method, code);

      res.json({
        method,
        message: method === "email"
          ? `Un code de vérification a été envoyé à ${user.email}`
          : `Un code de vérification SMS a été envoyé au ${user.phone || "numéro renseigné"}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/send-otp", async (req: AuthRequest, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }

    const method = user.twoFactorMethod || "email";
    if (method === "app") {
      res.status(400).json({ error: "Utilisez votre application d'authentification" });
      return;
    }

    const code = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(usersTable).set({
      otpCode: code,
      otpExpiry,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    await sendOTPToUser(user, method, code);

    res.json({
      message: method === "email"
        ? `Code envoyé à ${user.email}`
        : `Code envoyé par SMS au ${user.phone || "numéro renseigné"}`,
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

    const method = user.twoFactorMethod || "app";

    if (method === "app") {
      if (!user.twoFactorPendingSecret) {
        res.status(400).json({ error: "Veuillez d'abord initialiser la configuration 2FA" }); return;
      }
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
        twoFactorMethod: "app",
        updatedAt: new Date(),
      }).where(eq(usersTable.id, user.id));
    } else {
      if (!user.otpCode || !user.otpExpiry) {
        res.status(400).json({ error: "Aucun code OTP en attente. Relancez l'envoi." }); return;
      }
      if (new Date() > user.otpExpiry) {
        res.status(400).json({ error: "Code expiré. Veuillez demander un nouveau code." }); return;
      }
      if (user.otpCode !== code) {
        res.status(400).json({ error: "Code invalide." }); return;
      }
      await db.update(usersTable).set({
        twoFactorEnabled: true,
        twoFactorMethod: method,
        otpCode: null,
        otpExpiry: null,
        twoFactorSecret: null,
        twoFactorPendingSecret: null,
        updatedAt: new Date(),
      }).where(eq(usersTable.id, user.id));
    }

    const label = method === "app" ? "Application d'authentification" : method === "email" ? "Email" : "SMS";
    res.json({ success: true, method, message: `Authentification 2FA par ${label} activée avec succès.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/disable", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { password, code } = req.body || {};
    if (!password) { res.status(400).json({ error: "Mot de passe requis" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) { res.status(404).json({ error: "Utilisateur non trouvé" }); return; }
    if (!user.twoFactorEnabled) { res.status(400).json({ error: "La 2FA n'est pas activée" }); return; }

    const validPw = await bcrypt.compare(password, user.passwordHash);
    if (!validPw) { res.status(401).json({ error: "Mot de passe incorrect" }); return; }

    const method = user.twoFactorMethod || "app";

    if (method === "app") {
      if (!code) { res.status(400).json({ error: "Code de l'application requis" }); return; }
      if (!user.twoFactorSecret) { res.status(400).json({ error: "Secret 2FA manquant" }); return; }
      const validCode = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code,
        window: 1,
      });
      if (!validCode) { res.status(401).json({ error: "Code 2FA invalide" }); return; }
    } else if (code) {
      if (!user.otpCode || !user.otpExpiry) {
        res.status(400).json({ error: "Aucun code OTP en attente. Demandez-en un via l'envoi." }); return;
      }
      if (new Date() > user.otpExpiry) {
        res.status(400).json({ error: "Code expiré. Demandez un nouveau code." }); return;
      }
      if (user.otpCode !== code) {
        res.status(401).json({ error: "Code OTP invalide" }); return;
      }
    }

    await db.update(usersTable).set({
      twoFactorEnabled: false,
      twoFactorMethod: null,
      twoFactorSecret: null,
      twoFactorPendingSecret: null,
      otpCode: null,
      otpExpiry: null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    res.json({ success: true, message: "Authentification à deux facteurs désactivée." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return false;

  const method = user.twoFactorMethod || "app";

  if (method === "app") {
    if (!user.twoFactorSecret) return false;
    return speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token: code, window: 1 });
  } else {
    if (!user.otpCode || !user.otpExpiry) return false;
    if (new Date() > user.otpExpiry) return false;
    const valid = user.otpCode === code;
    if (valid) {
      await db.update(usersTable).set({ otpCode: null, otpExpiry: null, updatedAt: new Date() }).where(eq(usersTable.id, userId));
    }
    return valid;
  }
}

export default router;
