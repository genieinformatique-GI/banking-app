import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Eye, EyeOff, CheckCircle, UserCheck, FileCheck, ShieldCheck, Wallet } from "lucide-react";
import logo from "@assets/logo_1773450356780.jpg";

const registerSchema = z.object({
  civility: z.string().optional(),
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  country: z.string().min(2, "Veuillez sélectionner votre pays"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Au moins une lettre majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const countries = [
  "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie", "Tunisie",
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Burkina Faso", "Niger",
  "Congo", "Gabon", "Madagascar", "Mauritanie", "Togo", "Bénin", "Guinée",
  "Luxembourg", "Allemagne", "Espagne", "Italie", "Portugal", "Pays-Bas",
  "Royaume-Uni", "États-Unis", "Brésil", "Mexique", "Autre"
];

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      civility: "", firstName: "", lastName: "", email: "",
      phone: "", country: "", password: "", confirmPassword: ""
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("bob_token", data.token);
        queryClient.invalidateQueries();
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: "Erreur d'inscription",
          description: error?.response?.data?.error || error?.message || "Vérifiez vos informations",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const { civility, confirmPassword, ...apiData } = values;
    registerMutation.mutate({ data: apiData });
  };

  const inp = (hasError?: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    border: `1px solid ${hasError ? "#dc3545" : "#ddd"}`,
    borderRadius: "6px",
    fontSize: "0.9rem",
    outline: "none",
    background: "white",
  });

  const errStyle = { color: "#dc3545", fontSize: "0.78rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" };
  const labelStyle = { display: "block", color: "#444", fontWeight: 600, fontSize: "0.85rem", marginBottom: "5px" };

  const errors = form.formState.errors;

  return (
    <PublicLayout>
      <PageTitle title="Activation de compte" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Activation de compte" }]} />

      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left info */}
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Rejoignez-nous</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>
                Ouvrez votre compte BOB en toute simplicité
              </h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "28px" }}>
                Accédez à notre plateforme sécurisée et commencez votre demande de remboursement en quelques minutes. Votre compte sera activé après vérification de vos informations par notre équipe.
              </p>

              <div className="space-y-5 mb-8">
                {[
                  { step: "1", icon: <UserCheck size={18} />, title: "Remplissez le formulaire", desc: "Fournissez vos informations personnelles complètes" },
                  { step: "2", icon: <FileCheck size={18} />, title: "Soumettez votre dossier", desc: "Joignez les preuves de vos investissements perdus" },
                  { step: "3", icon: <ShieldCheck size={18} />, title: "Activation du compte", desc: "Notre équipe valide votre demande sous 24h" },
                  { step: "4", icon: <Wallet size={18} />, title: "Démarrez le remboursement", desc: "Accédez à votre espace et suivez votre dossier" },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: "0.95rem" }}>
                      {step}
                    </div>
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#f6a821" }}>{icon}</span>
                        {title}
                      </div>
                      <div style={{ color: "#777", fontSize: "0.875rem", marginTop: "2px" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#225473", borderRadius: "12px", padding: "24px", color: "white" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Déjà client ?</h4>
                <p style={{ color: "#b8d4e8", fontSize: "0.9rem", marginBottom: "16px" }}>
                  Connectez-vous à votre espace client pour accéder à vos services.
                </p>
                <Link href="/espace-client">
                  <button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 22px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
                    className="hover:opacity-90 transition-opacity">
                    Se connecter
                  </button>
                </Link>
              </div>
            </div>

            {/* Registration Form */}
            <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <img src={logo} alt="Bank of Blockchain" style={{ height: "50px", width: "auto", margin: "0 auto 14px", objectFit: "contain" }} />
                <h3 style={{ color: "#225473", fontSize: "1.3rem", fontWeight: 800 }}>Créer mon compte</h3>
                <p style={{ color: "#777", fontSize: "0.85rem", marginTop: "4px" }}>Tous les champs marqués * sont obligatoires</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Civilité */}
                <div>
                  <label style={labelStyle}>Civilité</label>
                  <select {...form.register("civility")} style={inp()}
                    onFocus={(e) => e.target.style.borderColor = "#225473"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}>
                    <option value="">— Sélectionner —</option>
                    <option value="M.">Monsieur</option>
                    <option value="Mlle">Mademoiselle</option>
                    <option value="Mme">Madame</option>
                  </select>
                </div>

                {/* Nom / Prénom */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input type="text" placeholder="Dupont" {...form.register("lastName")} style={inp(!!errors.lastName)}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.lastName ? "#dc3545" : "#ddd"} />
                    {errors.lastName && <p style={errStyle}><CheckCircle size={12} />{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Prénom *</label>
                    <input type="text" placeholder="Jean" {...form.register("firstName")} style={inp(!!errors.firstName)}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.firstName ? "#dc3545" : "#ddd"} />
                    {errors.firstName && <p style={errStyle}><CheckCircle size={12} />{errors.firstName.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Adresse email *</label>
                  <input type="email" placeholder="jean.dupont@email.com" autoComplete="email" {...form.register("email")} style={inp(!!errors.email)}
                    onFocus={(e) => e.target.style.borderColor = "#225473"}
                    onBlur={(e) => e.target.style.borderColor = errors.email ? "#dc3545" : "#ddd"} />
                  {errors.email && <p style={errStyle}><CheckCircle size={12} />{errors.email.message}</p>}
                </div>

                {/* Téléphone / Pays */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" placeholder="+33 6 00 00 00 00" {...form.register("phone")} style={inp()}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Pays *</label>
                    <select {...form.register("country")} style={inp(!!errors.country)}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.country ? "#dc3545" : "#ddd"}>
                      <option value="">— Sélectionner —</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p style={errStyle}><CheckCircle size={12} />{errors.country.message}</p>}
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label style={labelStyle}>Mot de passe *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password"
                      {...form.register("password")} style={{ ...inp(!!errors.password), paddingRight: "44px" }}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.password ? "#dc3545" : "#ddd"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0" }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p style={errStyle}><CheckCircle size={12} />{errors.password.message}</p>}
                  <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "4px" }}>8 caractères min., 1 majuscule, 1 chiffre</p>
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label style={labelStyle}>Confirmer le mot de passe *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showConfirm ? "text" : "password"} placeholder="••••••••" autoComplete="new-password"
                      {...form.register("confirmPassword")} style={{ ...inp(!!errors.confirmPassword), paddingRight: "44px" }}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? "#dc3545" : "#ddd"} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0" }}>
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={errStyle}><CheckCircle size={12} />{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={registerMutation.isPending}
                  style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: "8px" }}
                  className="hover:opacity-90 transition-opacity disabled:opacity-60">
                  {registerMutation.isPending ? "Création en cours..." : "Créer mon compte"}
                </button>
              </form>

              <div style={{ borderTop: "1px solid #eee", marginTop: "20px", paddingTop: "16px", textAlign: "center" }}>
                <p style={{ color: "#777", fontSize: "0.88rem" }}>
                  Déjà client ?{" "}
                  <Link href="/espace-client" style={{ color: "#225473", fontWeight: 700 }} className="hover:underline">
                    Se connecter
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
