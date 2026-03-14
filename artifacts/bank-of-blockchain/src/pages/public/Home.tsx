import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle, Shield, TrendingUp, Users, Globe, Star,
  ChevronLeft, ChevronRight, Banknote, Lock, Handshake,
  PieChart, FileText, Receipt, Eye, EyeOff, ArrowRight,
  Award, BarChart3, Clock, Zap
} from "lucide-react";

import hero1 from "@assets/hero1.jpg";
import hero2 from "@assets/hero2.jpg";
import expert from "@assets/expert.jpg";
import consulting from "@assets/consulting.jpg";
import blockchain from "@assets/blockchain.jpg";
import bitcoinGold from "@assets/bitcoin-gold.jpg";

const countries = [
  "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie", "Tunisie",
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Burkina Faso", "Niger",
  "Congo", "Gabon", "Madagascar", "Mauritanie", "Togo", "Bénin", "Guinée",
  "Luxembourg", "Allemagne", "Espagne", "Italie", "Portugal", "Pays-Bas",
  "Royaume-Uni", "États-Unis", "Brésil", "Mexique", "Autre"
];

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
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const heroImgs = [hero1, hero2];
const heroLinks = [
  { cta: "/ouverture-de-compte", cta2: "/la-banque" },
  { cta: "/nos-services/securisation-des-investissements", cta2: "/contact" },
];

const serviceIcons = [<Banknote size={28} />, <Lock size={28} />, <Handshake size={28} />, <TrendingUp size={28} />, <FileText size={28} />, <Receipt size={28} />];
const serviceHrefs = ["/nos-services/remboursement-des-pertes", "/nos-services/securisation-des-investissements", "/nos-services/conseil-et-accompagnement", "/nos-services/services-de-staking", "/nos-services/licence-de-trading", "/nos-services/taxe-crypto"];
const serviceColors = ["#225473", "#1a4a6b", "#0f3352", "#1e5c3d", "#3d2c7a", "#5c2a1e"];

const stepIcons = [<FileText size={24} />, <Shield size={24} />, <BarChart3 size={24} />, <Banknote size={24} />];
const stepNums = ["01", "02", "03", "04"];

const featureIcons = [<Award size={20} />, <Shield size={20} />, <Clock size={20} />, <Zap size={20} />];

const testimonials = [
  { initials: "SL", name: "Sophie L.", role: "Cliente, Paris", rating: 5, text: "Une solution unique et indispensable ! Enfin un service qui protège vraiment les investisseurs contre les arnaques et les faillites crypto." },
  { initials: "LM", name: "Léa M.", role: "Cliente, Lyon", rating: 5, text: "Grâce à BOB, j'ai pu récupérer mes pertes rapidement et efficacement. Je recommande vivement leurs services à tous." },
  { initials: "MD", name: "Marc D.", role: "Client, Genève", rating: 5, text: "Le processus est simple, rapide et totalement sécurisé. J'ai récupéré mes pertes en quelques jours. Merci BOB !" },
  { initials: "PV", name: "Pierre V.", role: "Client, Bruxelles", rating: 5, text: "J'étais sceptique au début, mais tout est transparent et automatisé via la blockchain. Une vraie révolution !" },
];

const partnerNames = ["UBS", "Crédit Suisse", "PostFinance", "Pictet", "ZKB", "UniCredit"];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} style={{ color: "#f6a821", fill: "#f6a821" }} />
      ))}
    </div>
  );
}

function HomeRegisterForm() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const r = t.public.home.register;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { civility: "", firstName: "", lastName: "", email: "", phone: "", country: "", password: "", confirmPassword: "" }
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
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${hasErr ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "8px", fontSize: "14px", outline: "none",
    background: "white", color: "#1a2637", transition: "border-color 0.2s",
    boxSizing: "border-box" as const
  });

  const lbl = { display: "block" as const, color: "#374151", fontWeight: 600 as const, fontSize: "13px", marginBottom: "6px" };
  const err = { color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex" as const, alignItems: "center" as const, gap: "4px" };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Civilité */}
      <div style={{ marginBottom: "18px" }}>
        <label style={lbl}>{r.civility}</label>
        <select {...form.register("civility")} style={{ ...inp(false), color: "#64748b" }}>
          <option value="">{r.selectPlaceholder}</option>
          <option value="M.">M.</option>
          <option value="Mme">Mme</option>
          <option value="Dr.">Dr.</option>
        </select>
      </div>

      {/* Nom / Prénom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
        <div>
          <label style={lbl}>{r.lastName} *</label>
          <input type="text" placeholder="Dupont" autoComplete="family-name" {...form.register("lastName")} style={inp(!!errors.lastName)}
            onFocus={e => e.target.style.borderColor = "#225473"}
            onBlur={e => e.target.style.borderColor = errors.lastName ? "#ef4444" : "#e2e8f0"} />
          {errors.lastName && <p style={err}>{errors.lastName.message}</p>}
        </div>
        <div>
          <label style={lbl}>{r.firstName} *</label>
          <input type="text" placeholder="Jean" autoComplete="given-name" {...form.register("firstName")} style={inp(!!errors.firstName)}
            onFocus={e => e.target.style.borderColor = "#225473"}
            onBlur={e => e.target.style.borderColor = errors.firstName ? "#ef4444" : "#e2e8f0"} />
          {errors.firstName && <p style={err}>{errors.firstName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: "18px" }}>
        <label style={lbl}>{r.email} *</label>
        <input type="email" placeholder="jean.dupont@email.com" autoComplete="email" {...form.register("email")} style={inp(!!errors.email)}
          onFocus={e => e.target.style.borderColor = "#225473"}
          onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0"} />
        {errors.email && <p style={err}>{errors.email.message}</p>}
      </div>

      {/* Téléphone / Pays */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
        <div>
          <label style={lbl}>{r.phone}</label>
          <input type="tel" placeholder="+33 6 00 00 00 00" autoComplete="tel" {...form.register("phone")} style={inp(false)}
            onFocus={e => e.target.style.borderColor = "#225473"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div>
          <label style={lbl}>{r.country} *</label>
          <select {...form.register("country")} style={{ ...inp(!!errors.country), color: form.watch("country") ? "#1a2637" : "#64748b" }}>
            <option value="">{r.selectPlaceholder}</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p style={err}>{errors.country.message}</p>}
        </div>
      </div>

      {/* Mot de passe */}
      <div style={{ marginBottom: "18px" }}>
        <label style={lbl}>{r.password} *</label>
        <div style={{ position: "relative" }}>
          <input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...form.register("password")} style={{ ...inp(!!errors.password), paddingRight: "44px" }}
            onFocus={e => e.target.style.borderColor = "#225473"}
            onBlur={e => e.target.style.borderColor = errors.password ? "#ef4444" : "#e2e8f0"} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && <p style={err}>{errors.password.message}</p>}
      </div>

      {/* Confirmation */}
      <div style={{ marginBottom: "24px" }}>
        <label style={lbl}>{r.confirmPassword} *</label>
        <div style={{ position: "relative" }}>
          <input type={showConfirm ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...form.register("confirmPassword")} style={{ ...inp(!!errors.confirmPassword), paddingRight: "44px" }}
            onFocus={e => e.target.style.borderColor = "#225473"}
            onBlur={e => e.target.style.borderColor = errors.confirmPassword ? "#ef4444" : "#e2e8f0"} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.confirmPassword && <p style={err}>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={registerMutation.isPending}
        style={{
          width: "100%", background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
          color: "white", border: "none", padding: "15px",
          borderRadius: "10px", fontWeight: "700", fontSize: "15px",
          cursor: "pointer", boxShadow: "0 6px 20px rgba(246,168,33,0.35)",
          opacity: registerMutation.isPending ? 0.7 : 1
        }}>
        {registerMutation.isPending ? r.submitting : r.submit}
      </button>

      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "14px" }}>
        {r.terms}{" "}
        <Link href="/contact" style={{ color: "#225473" }}>{r.termsLink}</Link>
      </p>
    </form>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const { t } = useLanguage();
  const h = t.public.home;

  const heroSlides = h.hero.map((s: any, i: number) => ({
    img: heroImgs[i],
    badge: s.badge,
    title: s.title,
    titleAccent: s.titleAccent,
    titleEnd: s.titleEnd,
    subtitle: s.subtitle,
    cta: { label: s.cta, href: heroLinks[i].cta },
    cta2: { label: s.cta2, href: heroLinks[i].cta2 },
  }));

  const statsIcons = [<Globe size={22} />, <Users size={22} />, <Banknote size={22} />, <Star size={22} />];
  const statsValues = ["65+", "10K+", "50M€", "98%"];
  const statsLabels = [h.stats.countries, h.stats.clients, h.stats.recovered, h.stats.satisfaction];
  const stats = statsLabels.map((label: string, i: number) => ({ value: statsValues[i], label, icon: statsIcons[i] }));

  const services = h.services.items.map((s: any, i: number) => ({
    icon: serviceIcons[i], title: s.title, desc: s.desc,
    href: serviceHrefs[i], color: serviceColors[i],
  }));

  const steps = h.steps.items.map((s: any, i: number) => ({
    num: stepNums[i], icon: stepIcons[i], title: s.title, desc: s.desc,
  }));

  const features = h.features.items.map((s: any, i: number) => ({
    icon: featureIcons[i], title: s.title, desc: s.desc,
  }));

  const current = heroSlides[slide];

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <PublicLayout>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #070e1a 0%, #0f2040 45%, #1a3d54 100%)",
        minHeight: "92vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Ambient gradients */}
        <div style={{ position: "absolute", top: "-200px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,84,115,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-150px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(246,168,33,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div style={{ animation: "fadeInLeft 0.8s ease" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(246,168,33,0.12)", border: "1px solid rgba(246,168,33,0.3)",
                borderRadius: "50px", padding: "8px 18px", marginBottom: "28px"
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f6a821", boxShadow: "0 0 10px #f6a821" }} />
                <span style={{ color: "#f6a821", fontSize: "13px", fontWeight: "600" }}>{current.badge}</span>
              </div>

              <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: "800", color: "white", lineHeight: 1.15, marginBottom: "24px", letterSpacing: "-1px" }}>
                {current.title}{" "}
                <span style={{ color: "#f6a821", textDecoration: "underline", textDecorationColor: "rgba(246,168,33,0.3)", textUnderlineOffset: "6px" }}>
                  {current.titleAccent}
                </span>
                {current.titleEnd}
              </h1>

              <p style={{ fontSize: "17px", color: "#94aec8", lineHeight: "1.8", marginBottom: "36px", maxWidth: "520px" }}>
                {current.subtitle}
              </p>

              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
                <Link href={current.cta.href}>
                  <button style={{
                    padding: "16px 32px", background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                    color: "white", border: "none", borderRadius: "10px",
                    fontWeight: "700", fontSize: "15px", cursor: "pointer",
                    boxShadow: "0 8px 30px rgba(246,168,33,0.4)",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    {current.cta.label} <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href={current.cta2.href}>
                  <button style={{
                    padding: "16px 32px", background: "rgba(255,255,255,0.06)",
                    color: "white", border: "1.5px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer",
                    backdropFilter: "blur(10px)"
                  }}>
                    {current.cta2.label}
                  </button>
                </Link>
              </div>

              {/* Slide indicators */}
              <div style={{ display: "flex", gap: "8px" }}>
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    style={{
                      width: i === slide ? "28px" : "8px", height: "8px",
                      borderRadius: "4px",
                      background: i === slide ? "#f6a821" : "rgba(255,255,255,0.2)",
                      border: "none", cursor: "pointer", transition: "all 0.3s ease"
                    }} />
                ))}
              </div>
            </div>

            {/* Right: hero image */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <div style={{
                position: "relative", borderRadius: "24px", overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                width: "100%", maxWidth: "520px"
              }}>
                <img src={current.img} alt="Blockchain Bank services"
                  style={{ width: "100%", height: "400px", objectFit: "cover", display: "block", transition: "opacity 0.6s ease" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,14,26,0.6) 0%, transparent 50%)" }} />
              </div>

              {/* Floating glass card */}
              <div style={{
                position: "absolute", bottom: "-20px", left: "-20px",
                background: "rgba(7,14,26,0.85)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(246,168,33,0.2)", borderRadius: "16px",
                padding: "16px 22px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
              }}>
                <div style={{ color: "#f6a821", fontSize: "24px", fontWeight: "800" }}>98%</div>
                <div style={{ color: "#94aec8", fontSize: "12px" }}>{h.stats.satisfaction}</div>
              </div>

              <div style={{
                position: "absolute", top: "20px", right: "-20px",
                background: "rgba(7,14,26,0.85)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(34,84,115,0.3)", borderRadius: "16px",
                padding: "16px 22px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
              }}>
                <div style={{ color: "white", fontSize: "22px", fontWeight: "800" }}>10K+</div>
                <div style={{ color: "#94aec8", fontSize: "12px" }}>{h.stats.clients}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <section style={{ background: "white", boxShadow: "0 4px 30px rgba(0,0,0,0.08)", position: "relative", zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: "32px 24px", textAlign: "center",
                borderRight: i < 3 ? "1px solid #f0f4f8" : "none",
                borderBottom: i < 2 ? "1px solid #f0f4f8" : "none"
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #f0f7ff, #e8f4fd)",
                  color: "#225473", marginBottom: "12px"
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "30px", fontWeight: "800", color: "#225473", lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─────────────────────────────────────────── */}
      <section style={{ background: "#f8fafd", padding: "40px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "28px" }}>
            {h.partners.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
            {partnerNames.map(name => (
              <div key={name} style={{
                padding: "12px 28px", background: "white",
                border: "1.5px solid #e8eef5", borderRadius: "10px",
                color: "#64748b", fontWeight: "800", fontSize: "15px",
                letterSpacing: "1px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / FEATURES ─────────────────────────────────── */}
      <section style={{ background: "white", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images grid */}
            <div style={{ position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
                  <img src={expert} alt="Expert BOB"
                    style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
                </div>
                <div>
                  <img src={consulting} alt="Conseil"
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                </div>
                <div>
                  <img src={blockchain} alt="Blockchain"
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                </div>
              </div>
              {/* Badge */}
              <div style={{
                position: "absolute", bottom: "-20px", right: "-10px",
                background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                borderRadius: "16px", padding: "22px 26px",
                boxShadow: "0 15px 40px rgba(246,168,33,0.35)",
                color: "white", textAlign: "center"
              }}>
                <div style={{ fontSize: "36px", fontWeight: "800", lineHeight: 1 }}>65+</div>
                <div style={{ fontSize: "12px", fontWeight: "600", opacity: 0.9, marginTop: "4px" }}>{h.stats.countries}</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>
                {h.features.label}
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: "#0f1e35", lineHeight: 1.2, marginBottom: "20px" }}>
                {h.features.title}
              </h2>
              <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "16px", marginBottom: "36px" }}>
                {h.features.subtitle}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
                {features.map(({ icon, title, desc }, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "46px", height: "46px", flexShrink: 0,
                      background: "linear-gradient(135deg, #f0f7ff, #e8f4fd)",
                      borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#225473"
                    }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ color: "#0f1e35", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{title}</div>
                      <div style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/la-banque">
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  padding: "14px 28px", background: "#225473",
                  color: "white", border: "none", borderRadius: "10px",
                  fontWeight: "700", fontSize: "15px", cursor: "pointer"
                }}>
                  {h.features.cta ?? h.features.title} <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────── */}
      <section style={{ background: "#f8fafd", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>{h.services.label}</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: "#0f1e35", marginBottom: "16px" }}>
              {h.services.title}
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7 }}>
              {h.services.subtitle}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {services.map((s, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  background: "white", borderRadius: "20px", padding: "36px 32px",
                  boxShadow: hoveredService === i ? "0 20px 60px rgba(0,0,0,0.12)" : "0 4px 20px rgba(0,0,0,0.04)",
                  transform: hoveredService === i ? "translateY(-6px)" : "none",
                  transition: "all 0.3s ease", cursor: "pointer",
                  borderTop: `4px solid ${hoveredService === i ? "#f6a821" : "transparent"}`
                }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px",
                  background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color, marginBottom: "22px",
                  border: `1px solid ${s.color}20`
                }}>
                  {s.icon}
                </div>
                <h3 style={{ color: "#0f1e35", fontWeight: "700", fontSize: "17px", marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>{s.desc}</p>
                <Link href={s.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#225473", fontWeight: "600", fontSize: "14px" }}>
                  {h.services.learnMore} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ──────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #070e1a 0%, #0f2040 100%)", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(34,84,115,0.2) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(246,168,33,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>{h.steps.label}</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: "white", marginBottom: "14px" }}>
              {h.steps.title}
            </h2>
            <p style={{ color: "#94aec8", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
              {h.steps.subtitle}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative", textAlign: "center" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "30px", left: "calc(50% + 50px)", right: "-50%", height: "2px", background: "linear-gradient(to right, rgba(246,168,33,0.4), transparent)", display: "none" }} className="hidden lg:block" />
                )}
                <div style={{
                  width: "64px", height: "64px", borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(246,168,33,0.15), rgba(246,168,33,0.05))",
                  border: "1px solid rgba(246,168,33,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#f6a821", margin: "0 auto 16px"
                }}>
                  {step.icon}
                </div>
                <div style={{ color: "#f6a821", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>
                  {h.steps.step} {step.num}
                </div>
                <h3 style={{ color: "white", fontWeight: "700", fontSize: "17px", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ color: "#64788b", fontSize: "14px", lineHeight: "1.7" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ background: "white", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>{h.testimonials.label}</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: "#0f1e35", marginBottom: "14px" }}>
              {h.testimonials.title}
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
              {h.testimonials.subtitle}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: "#f8fafd", borderRadius: "20px", padding: "32px 28px",
                border: "1.5px solid #f0f4f8", position: "relative"
              }}>
                <div style={{ position: "absolute", top: "24px", right: "28px", color: "#e2e8f0", fontSize: "48px", lineHeight: 1, fontFamily: "serif" }}>"</div>
                <StarRating count={t.rating} />
                <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.8", margin: "16px 0 24px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", borderTop: "1px solid #e8eef5", paddingTop: "20px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #225473, #1a3d54)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "700", fontSize: "14px", flexShrink: 0
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ color: "#0f1e35", fontWeight: "700", fontSize: "14px" }}>{t.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BAND ───────────────────────────────────────── */}
      <section style={{ position: "relative", height: "260px", overflow: "hidden" }}>
        <img src={bitcoinGold} alt="Crypto" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(7,14,26,0.72)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "0 24px" }}>
          <h2 style={{ color: "white", fontSize: "clamp(22px, 4vw, 38px)", fontWeight: "800", marginBottom: "12px" }}>
            {h.cta.title}
          </h2>
          <p style={{ color: "#94aec8", fontSize: "16px", marginBottom: "28px" }}>{h.cta.subtitle}</p>
          <Link href="/ouverture-de-compte">
            <button style={{
              padding: "15px 36px", background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
              color: "white", border: "none", borderRadius: "10px",
              fontWeight: "700", fontSize: "16px", cursor: "pointer",
              boxShadow: "0 8px 30px rgba(246,168,33,0.4)",
              display: "inline-flex", alignItems: "center", gap: "10px"
            }}>
              {h.register.sectionCta} <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── REGISTER FORM ────────────────────────────────────── */}
      <section style={{ background: "#f8fafd", padding: "100px 0" }} id="ouvrir-compte">
        <div className="max-w-6xl mx-auto px-6">
          <div style={{
            background: "white", borderRadius: "24px", overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.1)", border: "1px solid #f0f4f8"
          }}>
            <div className="grid lg:grid-cols-5">
              {/* Left dark panel */}
              <div className="lg:col-span-2" style={{
                background: "linear-gradient(135deg, #070e1a 0%, #0f2040 60%, #1a3d54 100%)",
                padding: "52px 44px", display: "flex", flexDirection: "column", justifyContent: "center"
              }}>
                <div style={{ color: "#f6a821", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>
                  {h.register.sectionLabel}
                </div>
                <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: "800", color: "white", lineHeight: 1.3, marginBottom: "20px" }}>
                  {h.register.sectionTitle}
                </h2>
                <p style={{ color: "#8899b0", fontSize: "14px", lineHeight: "1.8", marginBottom: "36px" }}>
                  {h.register.sectionDesc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {h.register.benefits.map((item: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "22px", height: "22px", borderRadius: "50%",
                        background: "rgba(246,168,33,0.15)", border: "1px solid rgba(246,168,33,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <CheckCircle size={13} style={{ color: "#f6a821" }} />
                      </div>
                      <span style={{ color: "#94aec8", fontSize: "14px" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right form */}
              <div className="lg:col-span-3" style={{ padding: "52px 44px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1e35", marginBottom: "6px" }}>{h.register.formTitle}</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "32px" }}>{h.register.formSubtitle}</p>
                <HomeRegisterForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
