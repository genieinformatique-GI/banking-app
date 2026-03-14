import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";

function useQueryParam(key: string): string {
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  return params.get(key) || "";
}

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const token = useQueryParam("token");

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Lien invalide ou manquant.");
      setValidating(false);
      return;
    }
    fetch(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) setTokenValid(true);
        else setTokenError(data.error || "Lien invalide ou expiré.");
      })
      .catch(() => setTokenError("Impossible de valider le lien."))
      .finally(() => setValidating(false));
  }, [token]);

  const strength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const s = strength();
  const strengthLabel = ["", "Faible", "Moyen", "Bon", "Fort"];
  const strengthColor = ["", "#dc2626", "#f6a821", "#0891b2", "#16a34a"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess(true);
      setTimeout(() => setLocation("/espace-client"), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 46px 13px 16px",
    background: "#f8fafd",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    color: "#1a2637",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafd", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Open Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#225473", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Sécurité du Compte
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f1e35", margin: 0, marginBottom: 8 }}>
            Nouveau mot de passe
          </h1>
        </div>

        <div style={{ background: "#ffffff", border: "1.5px solid #f0f4f8", borderRadius: 16, padding: 40, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
          {validating && (
            <div style={{ textAlign: "center", color: "#64748b", padding: "24px 0" }}>
              ⏳ Validation du lien en cours...
            </div>
          )}

          {!validating && !tokenValid && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
              <h3 style={{ color: "#0f1e35", margin: "0 0 12px", fontSize: 18, fontWeight: 800 }}>Lien invalide</h3>
              <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>{tokenError}</p>
              <Link href="/mot-de-passe-oublie" style={{
                display: "inline-block", padding: "12px 28px",
                background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                color: "#fff", textDecoration: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
              }}>
                Faire une nouvelle demande
              </Link>
            </div>
          )}

          {!validating && tokenValid && !success && (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#dc2626", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Nouveau mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caractères" required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: s >= i ? strengthColor[s] : "#e2e8f0", transition: "background 0.3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: strengthColor[s], fontWeight: 600 }}>{strengthLabel[s]}</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Confirmer le mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Répétez le mot de passe" required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p style={{ color: "#dc2626", fontSize: 12, margin: "6px 0 0", fontWeight: 600 }}>Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button type="submit" disabled={loading || !password || !confirm}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                  border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  boxShadow: "0 6px 20px rgba(34,84,115,0.3)",
                }}>
                {loading ? "Réinitialisation..." : "Réinitialiser mon mot de passe"}
              </button>
            </form>
          )}

          {!validating && success && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h3 style={{ color: "#0f1e35", margin: "0 0 12px", fontSize: 18, fontWeight: 800 }}>Mot de passe modifié !</h3>
              <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>
                Votre mot de passe a été réinitialisé. Vous serez redirigé vers la connexion dans quelques secondes...
              </p>
              <Link href="/espace-client" style={{
                display: "inline-block", padding: "12px 28px",
                background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                color: "#fff", textDecoration: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
              }}>
                Se connecter maintenant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
