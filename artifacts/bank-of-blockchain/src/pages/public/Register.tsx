import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle, ArrowRight, Shield, Clock, Users, Award } from "lucide-react";
import { LogoBrand } from "@/components/ui/LogoBrand";
import expert from "@assets/expert.jpg";

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
    .regex(/[A-Z]/, "Au moins une lettre majuscule requise")
    .regex(/[0-9]/, "Au moins un chiffre requis"),
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
          title: "Erreur lors de l'inscription",
          description: error?.response?.data?.error || error?.message || "Une erreur s'est produite",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const { civility: _c, confirmPassword: _cp, ...data } = values;
    registerMutation.mutate({ data });
  };

  const errors = form.formState.errors;

  const inp = (hasErr: boolean) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${hasErr ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "9px",
    fontSize: "13.5px",
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
    fontSize: "12.5px",
    marginBottom: "6px"
  };

  const errStyle = { color: "#ef4444", fontSize: "11.5px", marginTop: "4px" };

  const highlights = [
    { icon: <Award size={18} />, text: "Certifié AMF & SEC" },
    { icon: <Shield size={18} />, text: "Sécurité de niveau bancaire" },
    { icon: <Clock size={18} />, text: "Activation en moins de 24h" },
    { icon: <Users size={18} />, text: "Plus de 10 000 clients satisfaits" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-5/12" style={{
        background: "linear-gradient(160deg, #070e1a 0%, #0f2040 55%, #1a3d54 100%)",
        flexDirection: "column", justifyContent: "space-between",
        padding: "48px 52px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-180px", right: "-120px", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,84,115,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(246,168,33,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
          <LogoBrand size="md" theme="dark" />
        </Link>

        <div style={{ position: "relative" }}>
          <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
            REJOIGNEZ-NOUS
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "white", lineHeight: 1.25, marginBottom: "18px" }}>
            Ouvrez votre compte et commencez à récupérer vos fonds
          </h1>
          <p style={{ color: "#8899b0", fontSize: "14px", lineHeight: "1.8", marginBottom: "36px" }}>
            Rejoignez des milliers d'investisseurs qui ont déjà récupéré leurs fonds crypto grâce à Blockchain Bank.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
            {highlights.map(({ icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: "rgba(246,168,33,0.1)", border: "1px solid rgba(246,168,33,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#f6a821"
                }}>
                  {icon}
                </div>
                <span style={{ color: "#94aec8", fontSize: "14px" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Expert image */}
          <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <img src={expert} alt="Nos experts" style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "top", display: "block", opacity: 0.85 }} />
          </div>
        </div>

        <div />
      </div>

      {/* Right: form */}
      <div style={{ flex: 1, background: "white", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ display: "inline-flex", justifyContent: "center" }}>
              <LogoBrand size="lg" theme="light" />
            </Link>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f1e35", marginBottom: "8px" }}>Créer mon compte</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>Tous les champs marqués * sont obligatoires</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Civilité */}
            <div style={{ marginBottom: "16px" }}>
              <label style={lbl}>Civilité</label>
              <select {...form.register("civility")} style={{ ...inp(false), color: "#64748b" }}>
                <option value="">Sélectionner</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>

            {/* Nom / Prénom */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={lbl}>Nom *</label>
                <input type="text" placeholder="Dupont" autoComplete="family-name" {...form.register("lastName")} style={inp(!!errors.lastName)}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = errors.lastName ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                {errors.lastName && <p style={errStyle}>{errors.lastName.message}</p>}
              </div>
              <div>
                <label style={lbl}>Prénom *</label>
                <input type="text" placeholder="Jean" autoComplete="given-name" {...form.register("firstName")} style={inp(!!errors.firstName)}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = errors.firstName ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                {errors.firstName && <p style={errStyle}>{errors.firstName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={lbl}>Adresse email *</label>
              <input type="email" placeholder="jean.dupont@email.com" autoComplete="email" {...form.register("email")} style={inp(!!errors.email)}
                onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
              {errors.email && <p style={errStyle}>{errors.email.message}</p>}
            </div>

            {/* Téléphone / Pays */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={lbl}>Téléphone</label>
                <input type="tel" placeholder="+33 6 00 00 00 00" autoComplete="tel" {...form.register("phone")} style={inp(false)}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
              </div>
              <div>
                <label style={lbl}>Pays *</label>
                <select {...form.register("country")} style={{ ...inp(!!errors.country), color: form.watch("country") ? "#1a2637" : "#64748b" }}>
                  <option value="">Sélectionner</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p style={errStyle}>{errors.country.message}</p>}
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={lbl}>Mot de passe *</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="8 caractères min, 1 majuscule, 1 chiffre" autoComplete="new-password" {...form.register("password")} style={{ ...inp(!!errors.password), paddingRight: "44px" }}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p style={errStyle}>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={lbl}>Confirmer le mot de passe *</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...form.register("confirmPassword")} style={{ ...inp(!!errors.confirmPassword), paddingRight: "44px" }}
                  onFocus={e => { e.target.style.borderColor = "#225473"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafd"; }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={registerMutation.isPending}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                color: "white", border: "none", padding: "15px",
                borderRadius: "10px", fontWeight: "700", fontSize: "15px",
                cursor: "pointer", marginBottom: "16px",
                boxShadow: "0 6px 20px rgba(246,168,33,0.35)",
                opacity: registerMutation.isPending ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
              {registerMutation.isPending ? "Création du compte..." : (
                <><span>Créer mon compte gratuitement</span> <ArrowRight size={18} /></>
              )}
            </button>

            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginBottom: "24px" }}>
              En créant un compte, vous acceptez nos{" "}
              <Link href="/contact" style={{ color: "#225473" }}>conditions d'utilisation</Link>
            </p>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "#f0f4f8" }} />
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>Déjà client ?</span>
            <div style={{ flex: 1, height: "1px", background: "#f0f4f8" }} />
          </div>

          <Link href="/espace-client">
            <button style={{
              width: "100%", padding: "13px",
              background: "transparent", border: "1.5px solid #225473",
              color: "#225473", borderRadius: "10px",
              fontWeight: "700", fontSize: "14px", cursor: "pointer"
            }}>
              Se connecter
            </button>
          </Link>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "13px" }} className="hover:text-[#225473] transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
