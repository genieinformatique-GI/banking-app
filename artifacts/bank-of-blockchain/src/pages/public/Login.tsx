import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Eye, EyeOff, BarChart2, FolderOpen, Bell, ShieldCheck } from "lucide-react";
import logo from "@assets/logo_1773450356780.jpg";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("bob_token", data.token);
        queryClient.invalidateQueries();
        if (data.user.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      },
      onError: (error: any) => {
        toast({
          title: "Erreur de connexion",
          description: error?.response?.data?.error || error?.message || "Identifiants invalides",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: values });
  };

  const features = [
    { icon: <BarChart2 size={20} />, label: "Tableau de bord personnalisé" },
    { icon: <FolderOpen size={20} />, label: "Suivi de vos dossiers en temps réel" },
    { icon: <Bell size={20} />, label: "Notifications et alertes de remboursement" },
    { icon: <ShieldCheck size={20} />, label: "Espace sécurisé et chiffré" },
  ];

  const errors = form.formState.errors;
  const labelStyle = { display: "block", color: "#444", fontWeight: 600, fontSize: "0.9rem", marginBottom: "6px" };
  const errStyle = { color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" };

  return (
    <PublicLayout>
      <PageTitle title="Espace Client" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Espace Client" }]} />

      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left info panel */}
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Votre espace</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>
                Accédez à votre espace client BOB
              </h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                Gérez vos investissements, suivez vos remboursements et accédez à tous nos services en toute sécurité depuis votre tableau de bord personnel.
              </p>
              <div className="space-y-4">
                {features.map(({ icon, label }, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <span style={{ color: "#f6a821" }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
              <div style={{ background: "#225473", borderRadius: "12px", padding: "24px", marginTop: "28px", color: "white" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Pas encore client ?</h4>
                <p style={{ color: "#b8d4e8", fontSize: "0.9rem", marginBottom: "16px" }}>
                  Créez votre compte gratuitement et commencez votre démarche de remboursement.
                </p>
                <Link href="/ouverture-de-compte">
                  <button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 22px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
                    className="hover:opacity-90 transition-opacity">
                    Ouvrir un compte
                  </button>
                </Link>
              </div>
            </div>

            {/* Login Form */}
            <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <img src={logo} alt="Bank of Blockchain" style={{ height: "50px", width: "auto", margin: "0 auto 16px", objectFit: "contain" }} />
                <h3 style={{ color: "#225473", fontSize: "1.4rem", fontWeight: 800 }}>Connexion</h3>
                <p style={{ color: "#777", fontSize: "0.9rem", marginTop: "6px" }}>Entrez vos identifiants pour accéder à votre espace</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label style={labelStyle}>Adresse email *</label>
                  <input type="email" placeholder="votre@email.com" autoComplete="email" {...form.register("email")}
                    style={{ width: "100%", padding: "12px 14px", border: `1px solid ${errors.email ? "#dc3545" : "#ddd"}`, borderRadius: "6px", fontSize: "0.9rem", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#225473"}
                    onBlur={(e) => e.target.style.borderColor = errors.email ? "#dc3545" : "#ddd"} />
                  {errors.email && <p style={errStyle}>{errors.email.message}</p>}
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex justify-between items-center" style={{ marginBottom: "6px" }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Mot de passe *</label>
                    <a href="#" style={{ color: "#225473", fontSize: "0.85rem", fontWeight: 600 }} className="hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" {...form.register("password")}
                      style={{ width: "100%", padding: "12px 44px 12px 14px", border: `1px solid ${errors.password ? "#dc3545" : "#ddd"}`, borderRadius: "6px", fontSize: "0.9rem", outline: "none" }}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.password ? "#dc3545" : "#ddd"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0" }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p style={errStyle}>{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={loginMutation.isPending}
                  style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: "8px" }}
                  className="hover:opacity-90 transition-opacity disabled:opacity-60">
                  {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              <div style={{ borderTop: "1px solid #eee", marginTop: "24px", paddingTop: "20px", textAlign: "center" }}>
                <p style={{ color: "#777", fontSize: "0.9rem" }}>
                  Pas encore de compte ?{" "}
                  <Link href="/ouverture-de-compte" style={{ color: "#225473", fontWeight: 700 }} className="hover:underline">
                    Créer mon compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
