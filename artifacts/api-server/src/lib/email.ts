import { Resend } from "resend";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM_EMAIL = process.env["FROM_EMAIL"] || "Bank of Blockchain <noreply@bankofblockchain.com>";
const APP_URL = process.env["APP_URL"] || "https://bfcc1fef-4bf7-45ce-b59b-72d24c6055e0-00-3tqv5tx1ik58i.janeway.replit.dev";

export async function sendPasswordResetEmail(to: string, firstName: string, token: string): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#070e1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070e1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b2e;border-radius:16px;border:1px solid #1e3a5f;overflow:hidden;max-width:560px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d2a42,#1a4a6e);padding:32px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              🏦 Bank of Blockchain
            </div>
            <div style="color:#f6a821;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">
              Sécurité du Compte
            </div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#94b8d6;font-size:16px;margin:0 0 8px 0;">Bonjour <strong style="color:#ffffff;">${firstName}</strong>,</p>
            <p style="color:#94b8d6;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
              Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </p>
            <!-- CTA Button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="background:#225473;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:10px;font-size:16px;font-weight:700;display:inline-block;letter-spacing:0.3px;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <!-- Info box -->
            <div style="background:#0a1929;border:1px solid #1e3a5f;border-radius:10px;padding:18px;margin:24px 0;">
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">⏱ Ce lien est valable <strong style="color:#f6a821;">1 heure</strong></p>
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">🔒 Il ne peut être utilisé qu'une seule fois</p>
              <p style="color:#64a0c8;font-size:13px;margin:0;">❌ Si vous n'êtes pas à l'origine de cette demande, ignorez cet email</p>
            </div>
            <!-- Link fallback -->
            <p style="color:#4a7a9b;font-size:12px;margin:24px 0 0 0;">
              Lien alternatif :<br>
              <span style="color:#5a9fc8;word-break:break-all;">${resetUrl}</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#070e1a;padding:20px 40px;text-align:center;border-top:1px solid #1e3a5f;">
            <p style="color:#3a6a8a;font-size:12px;margin:0;">
              © ${new Date().getFullYear()} Bank of Blockchain — Tous droits réservés<br>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (resend) {
    try {
      await resend.emails.send({ from: FROM_EMAIL, to, subject: "Réinitialisation de votre mot de passe — Bank of Blockchain", html });
      return true;
    } catch (err) {
      console.error("[Email] Resend failed:", err);
    }
  }

  console.log(`[Email] RESET LINK (no email provider configured):\n  To: ${to}\n  URL: ${resetUrl}\n  Token: ${token}`);
  return !!resend;
}

export async function sendAccountActivationEmail(to: string, firstName: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#070e1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070e1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b2e;border-radius:16px;border:1px solid #1e3a5f;overflow:hidden;max-width:560px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d2a42,#1a4a6e);padding:32px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              🏦 Bank of Blockchain
            </div>
            <div style="color:#f6a821;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">
              Activation du Compte
            </div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#94b8d6;font-size:16px;margin:0 0 8px 0;">Bonjour <strong style="color:#ffffff;">${firstName}</strong>,</p>
            <p style="color:#94b8d6;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
              Votre compte a été activé avec succès par un administrateur. Vous pouvez maintenant vous connecter à votre compte et accéder à tous les services de la Bank of Blockchain.
            </p>
            <!-- Info box -->
            <div style="background:#0a1929;border:1px solid #1e3a5f;border-radius:10px;padding:18px;margin:24px 0;">
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">✅ Votre compte est maintenant actif</p>
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">🔐 Connectez-vous avec vos identifiants habituels</p>
              <p style="color:#64a0c8;font-size:13px;margin:0;">💰 Accédez à vos comptes et effectuez des transactions</p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#070e1a;padding:20px 40px;text-align:center;border-top:1px solid #1e3a5f;">
            <p style="color:#3a6a8a;font-size:12px;margin:0;">
              © ${new Date().getFullYear()} Bank of Blockchain — Tous droits réservés<br>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (resend) {
    try {
      await resend.emails.send({ from: FROM_EMAIL, to, subject: "Votre compte a été activé — Bank of Blockchain", html });
      return true;
    } catch (err) {
      console.error("[Email] Resend failed:", err);
    }
  }

  console.log(`[Email] ACTIVATION (no email provider configured):\n  To: ${to}\n  Subject: Votre compte a été activé — Bank of Blockchain`);
  return !!resend;
}

export async function sendAccountRejectionEmail(to: string, firstName: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#070e1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070e1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b2e;border-radius:16px;border:1px solid #1e3a5f;overflow:hidden;max-width:560px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d2a42,#1a4a6e);padding:32px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              🏦 Bank of Blockchain
            </div>
            <div style="color:#f6a821;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">
              Notification de Compte
            </div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#94b8d6;font-size:16px;margin:0 0 8px 0;">Bonjour <strong style="color:#ffffff;">${firstName}</strong>,</p>
            <p style="color:#94b8d6;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
              Nous vous informons que votre compte a été rejeté par un administrateur. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre service client pour obtenir de l'aide.
            </p>
            <!-- Info box -->
            <div style="background:#0a1929;border:1px solid #1e3a5f;border-radius:10px;padding:18px;margin:24px 0;">
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">❌ Votre compte a été rejeté</p>
              <p style="color:#64a0c8;font-size:13px;margin:0 0 8px 0;">📞 Contactez le service client pour plus d'informations</p>
              <p style="color:#64a0c8;font-size:13px;margin:0;">📧 support@bankofblockchain.com</p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#070e1a;padding:20px 40px;text-align:center;border-top:1px solid #1e3a5f;">
            <p style="color:#3a6a8a;font-size:12px;margin:0;">
              © ${new Date().getFullYear()} Bank of Blockchain — Tous droits réservés<br>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (resend) {
    try {
      await resend.emails.send({ from: FROM_EMAIL, to, subject: "Notification concernant votre compte — Bank of Blockchain", html });
      return true;
    } catch (err) {
      console.error("[Email] Resend failed:", err);
    }
  }

  console.log(`[Email] REJECTION (no email provider configured):\n  To: ${to}\n  Subject: Notification concernant votre compte — Bank of Blockchain`);
  return !!resend;
}
