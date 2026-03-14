import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, BarChart2, FolderOpen, Bell, ShieldCheck, ArrowRight } from "lucide-react";
import logo from "@assets/logo.jpg";
import blockchain from "@assets/blockchain.jpg";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type Step = "login" | "2fa";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("login");
  const [tempToken, setTempToken] = useState("");
  const [tfaCode, setTfaCode] = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem("bob_token", data.token);
    queryClient.invalidateQueries();
    if (data.user.role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Identifiants invalides");

      if (data.requiresTwoFactor) {
        setTempToken(data.tempToken);
        setStep("2fa");
        return;
      }
      handleLoginSuccess(data);
    } catch (err: any) {
      toast({ title: "Erreur de connexion", description: err.message || "Identifiants invalides", variant: "destructive" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tfaCode) return;
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/login/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code: tfaCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Code invalide");
      handleLoginSuccess(data);
    } catch (err: any) {
      toast({ title: "Code invalide", description: err.message, variant: "destructive" });
      setTfaCode("");
    } finally {
      setTfaLoading(false);
    }
  };

  const errors = form.formState.errors;

  const inp = (hasErr: boolean) => ({
    width: "100%",
    padding: "13px 16px",
    border: `1.5px solid ${hasErr ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafd",
    color: "#1a2637",
    transition: "all 0.2s",
    boxSizing: "border-box" as const
  });

  const lbl = {
    display: "block" as const,
    color: "#374151",
    fontWeight: 600 as const,
    fontSize: "13px",
    marginBottom: "7px"
  };

  const err = { color: "#ef4444", fontSize: "12px", marginTop: "5px" };

  const benefits = [
    { icon: <BarChart2 size={18} />, label: "Tableau de bord personnalisé" },
    { icon: <FolderOpen size={18} />, label: "Suivi de vos dossiers en temps réel" },
    { icon: <Bell size={18} />, label: "Notifications de remboursement" },
    { icon: <ShieldCheck size={18} />, label: "Espace sécurisé et chiffré" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-5/12" style={{
        background: "linear-gradient(135deg, #070e1a 0%, #0f2040 50%, #1a3d54 100%)",
        flexDirection: "column", justifyContent: "space-between", padding: "48px 56px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-150px", right: "-150px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,84,115,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(246,168,33,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", position: "relative" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "6px 12px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <img src={logo} alt="Bank of Blockchain" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          </div>
        </Link>

        <div style={{ position: "relative" }}>
          <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
            ESPACE CLIENT
          </div>
          <h1 style={{ fontSize: "34px", fontWeight: "800", color: "white", lineHeight: 1.2, marginBottom: "20px" }}>
            Bienvenue dans votre espace sécurisé
          </h1>
          <p style={{ color: "#8899b0", fontSize: "15px", lineHeight: "1.8", marginBottom: "40px" }}>
            Gérez vos investissements, suivez vos remboursements et accédez à tous nos services depuis votre tableau de bord personnel.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "48px" }}>
            {benefits.map(({ icon, label }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: "rgba(246,168,33,0.1)", border: "1px solid rgba(246,168,33,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#f6a821", flexShrink: 0
                }}>
                  {icon}
                </div>
                <span style={{ color: "#94aec8", fontSize: "14px" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Image */}
          <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <img src={blockchain} alt="Blockchain" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", opacity: 0.8 }} />
          </div>
        </div>

        <div />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center" style={{ background: "white", padding: "40px 24px", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "36px" }}>
            <Link href="/">
              <img src={logo} alt="Bank of Blockchain" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
            </Link>
          </div>

          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f1e35", marginBottom: "8px" }}>
              {step === "2fa" ? "Vérification en 2 étapes" : "Connexion"}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>
              {step === "2fa" ? "Entrez le code généré par votre application d'authentification." : "Entrez vos identifiants pour accéder à votre espace"}
            </p>
          </div>

          {step === "2fa" ? (
            <form onSubmit={handleTwoFactor}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 64, height: 64, background: "rgba(34,84,115,0.08)",
                  borderRadius: "50%", marginBottom: 16
                }}>
                  <ShieldCheck size={30} color="#225473" />
                </div>
                <p style={{ color: "#64748b", fontSize: 13 }}>
                  🔐 Ouvrez votre application Google Authenticator ou Authy et saisissez le code à 6 chiffres.
                </p>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Code d'authentification</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={tfaCode}
                  onChange={e => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  autoFocus
                  style={{ ...inp(false), textAlign: "center", fontSize: "28px", letterSpacing: "10px", fontWeight: 700 }}
                />
              </div>
              <button type="submit" disabled={tfaLoading || tfaCode.length !== 6}
                style={{
                  width: "100%", background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                  color: "white", border: "none", padding: "15px",
                  borderRadius: "10px", fontWeight: "700", fontSize: "15px",
                  cursor: tfaLoading || tfaCode.length !== 6 ? "not-allowed" : "pointer",
                  marginBottom: "16px", opacity: tfaLoading ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                {tfaLoading ? "Vérification..." : <><span>Vérifier le code</span> <ArrowRight size={18} /></>}
              </button>
              <button type="button" onClick={() => { setStep("login"); setTfaCode(""); setTempToken(""); }}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", width: "100%", fontSize: 13 }}>
                ← Retour à la connexion
              </button>
            </form>
          ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={lbl}>Adresse email *</label>
              <input type="email" placeholder="votre@email.com" autoComplete="email" {...form.register("email")}
                style={inp(!!errors.email)}
                onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
              {errors.email && <p style={err}>{errors.email.message}</p>}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Mot de passe *</label>
                <Link href="/mot-de-passe-oublie" style={{ color: "#225473", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" {...form.register("password")}
                  style={{ ...inp(!!errors.password), paddingRight: "46px" }}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={err}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loginLoading}
              style={{
                width: "100%", background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)",
                color: "white", border: "none", padding: "15px",
                borderRadius: "10px", fontWeight: "700", fontSize: "15px",
                cursor: "pointer", marginBottom: "20px",
                boxShadow: "0 6px 20px rgba(34,84,115,0.35)",
                opacity: loginLoading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
              {loginLoading ? "Connexion en cours..." : (
                <><span>Se connecter</span> <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "#f0f4f8" }} />
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "#f0f4f8" }} />
          </div>

          <div style={{
            background: "#f8fafd", borderRadius: "14px", padding: "24px",
            border: "1.5px solid #f0f4f8", textAlign: "center"
          }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "14px" }}>
              Vous n'avez pas encore de compte ?
            </p>
            <Link href="/ouverture-de-compte">
              <button style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                color: "white", border: "none", borderRadius: "10px",
                fontWeight: "700", fontSize: "14px", cursor: "pointer",
                boxShadow: "0 4px 15px rgba(246,168,33,0.3)"
              }}>
                Créer mon compte gratuitement
              </button>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "13px" }} className="hover:text-[#225473] transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
