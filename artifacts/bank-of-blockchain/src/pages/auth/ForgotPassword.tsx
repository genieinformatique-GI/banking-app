import { useState } from "react";
import { Link } from "wouter";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafd", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Open Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#225473", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Sécurité du Compte
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f1e35", margin: 0, marginBottom: 8 }}>
            Mot de passe oublié
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          border: "1.5px solid #f0f4f8",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>📧</div>
              <h3 style={{ color: "#0f1e35", margin: "0 0 12px", fontSize: 20, fontWeight: 800 }}>Email envoyé !</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
                Si un compte existe avec <strong style={{ color: "#0f1e35" }}>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <div style={{
                background: "#fef9ef",
                border: "1px solid #f6d991",
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 28,
                textAlign: "left"
              }}>
                <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                  ⏱ Le lien est valable <strong style={{ color: "#f6a821" }}>1 heure</strong><br />
                  📁 Vérifiez aussi vos dossiers de spam
                </p>
              </div>
              <Link href="/espace-client" style={{
                display: "inline-block",
                color: "#225473",
                fontSize: 14,
                textDecoration: "none",
                fontWeight: 600,
              }}>
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 20,
                  color: "#dc2626",
                  fontSize: 13,
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    background: "#f8fafd",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    color: "#1a2637",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafd"; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 6px 20px rgba(34,84,115,0.3)",
                  marginBottom: 20,
                }}
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>

              <div style={{ textAlign: "center" }}>
                <Link href="/espace-client" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
