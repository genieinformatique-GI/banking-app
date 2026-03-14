import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PublicLayout from "@/components/layout/PublicLayout";
import {
  CheckCircle, Shield, TrendingUp, Users, Globe, Star,
  ChevronLeft, ChevronRight, Banknote, Lock, Handshake,
  PieChart, FileText, Receipt, Building2, Link2, BarChart2,
  Eye, EyeOff, UserCheck, FileCheck, ShieldCheck, Wallet
} from "lucide-react";

import hero1 from "@assets/3c65477ee3ffb8ebdf1daaa243c237fd_1773450356780.jpg";
import hero2 from "@assets/005a0e171045f2457c17a0ae0940821e_1773450356780.jpg";
import aboutImg1 from "@assets/6cceab4d561eba559cf471a4d2990462_1773450356780.jpg";
import aboutImg2 from "@assets/fec081469d4bc03e66c813538b46e09b_1773450356780.jpg";
import expertImg from "@assets/29d7b62f7418c70be8a5042ad5e1d0e9_1773450356780.jpg";
import tradingImg from "@assets/dbeb05576271d11b9a53d9a03c85f3c7_1773450356780.jpg";

const heroSlides = [
  {
    bg: "linear-gradient(135deg, #0f2940 0%, #225473 60%, #1a3d54 100%)",
    img: hero1,
    title: "Remboursement des Pertes en Cryptomonnaies",
    subtitle: "La Bank of Blockchain vous aide à récupérer vos fonds perdus sur des plateformes frauduleuses grâce à nos smart contracts et partenariats avec l'AMF et la SEC.",
    cta: { label: "Ouvrir mon compte de Remboursement", href: "/ouverture-de-compte" },
    cta2: { label: "En savoir plus", href: "/la-banque" },
  },
  {
    bg: "linear-gradient(135deg, #1a3020 0%, #2d5a3d 50%, #1e4a30 100%)",
    img: hero2,
    title: "Sécurisation & Protection de Vos Investissements",
    subtitle: "Nous mettons en place des mécanismes avancés de protection pour garantir la sécurité de vos actifs numériques et vous offrir la tranquillité d'esprit.",
    cta: { label: "Découvrir nos services", href: "/nos-services/securisation-des-investissements" },
    cta2: { label: "Nous contacter", href: "/contact" },
  },
];

const services = [
  { icon: <Banknote size={32} />, title: "Remboursement des pertes", desc: "Récupérez vos fonds perdus sur des plateformes de crypto non réglementées grâce à nos procédures légales et blockchain.", href: "/nos-services/remboursement-des-pertes" },
  { icon: <Lock size={32} />, title: "Sécurisation des investissements", desc: "Protégez vos actifs numériques avec nos solutions de sécurité avancées et nos smart contracts audités.", href: "/nos-services/securisation-des-investissements" },
  { icon: <Handshake size={32} />, title: "Conseil & accompagnement", desc: "Bénéficiez de l'expertise de nos conseillers spécialisés en cryptomonnaies et finance décentralisée.", href: "/nos-services/conseil-et-accompagnement" },
  { icon: <TrendingUp size={32} />, title: "Services de staking", desc: "Faites fructifier vos cryptomonnaies grâce à nos services de staking sécurisés et rentables.", href: "/nos-services/services-de-staking" },
  { icon: <FileText size={32} />, title: "Licence de Trading", desc: "Obtenez votre licence de trading officielle pour exercer légalement sur les marchés de cryptomonnaies.", href: "/nos-services/licence-de-trading" },
  { icon: <Receipt size={32} />, title: "Taxe Crypto", desc: "Simplifiez vos obligations fiscales liées aux cryptomonnaies avec notre service de gestion fiscale automatisée.", href: "/nos-services/taxe-crypto" },
];

const testimonials = [
  { name: "Sophie L.", role: "Cliente", text: "Une solution unique et indispensable ! Enfin un service qui protège les investisseurs contre les arnaques et les faillites." },
  { name: "Léa M.", role: "Cliente", text: "Grâce à BOB, j'ai pu récupérer mes pertes rapidement et efficacement. Je recommande vivement leurs services." },
  { name: "Marc D.", role: "Client", text: "Le processus est simple, rapide et totalement sécurisé. J'ai récupéré mes pertes en quelques jours grâce à BOB." },
  { name: "Pierre V.", role: "Client", text: "J'étais sceptique au début, mais tout est transparent et automatisé via la blockchain. Une vraie révolution pour la protection des investisseurs !" },
];

const partnerNames = ["UBS", "Crédit Suisse", "PostFinance", "Pictet", "ZKB", "UniCredit"];

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
    .regex(/[A-Z]/, "Au moins une lettre majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const current = heroSlides[slide];

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section style={{ background: current.bg, transition: "background 0.8s ease", minHeight: "560px", position: "relative", overflow: "hidden" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 style={{ color: "white", fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.25, marginBottom: "20px" }}>
                {current.title}
              </h1>
              <p style={{ color: "#b8d4e8", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "32px" }}>
                {current.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={current.cta.href}>
                  <button style={{ background: "#f6a821", color: "white", border: "none", padding: "14px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                    className="hover:opacity-90 transition-opacity">
                    {current.cta.label}
                  </button>
                </Link>
                <Link href={current.cta2.href}>
                  <button style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", padding: "14px 28px", borderRadius: "6px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
                    className="hover:border-white hover:bg-white/10 transition-all">
                    {current.cta2.label}
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <img src={current.img} alt="Hero" style={{ width: "100%", maxWidth: "420px", height: "340px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>
        {/* Slide controls */}
        <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 20 }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: i === slide ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === slide ? "#f6a821" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
        <button onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}
          className="hover:bg-white/25 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}
          className="hover:bg-white/25 transition-colors">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* About Section */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src={aboutImg1} alt="Banque blockchain" style={{ width: "100%", height: "220px", borderRadius: "12px", objectFit: "cover" }} />
              <img src={aboutImg2} alt="Finance numérique" style={{ width: "100%", height: "220px", borderRadius: "12px", objectFit: "cover", marginTop: "32px" }} />
            </div>
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>A Propos</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>Découvrez La Bank of Blockchain</h2>
              <p style={{ color: "#555", fontWeight: 600, lineHeight: 1.75, marginBottom: "14px" }}>
                La banque blockchain est l'organisme de régulation des transactions de cryptomonnaie sur le marché financier. Nous travaillons en collaboration avec l'AMF et la SEC pour assurer la transparence et la sécurité des investissements en actifs numériques.
              </p>
              <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "24px" }}>
                Nous sommes là pour rembourser toutes les personnes qui ont investi de l'argent sans toutefois perdre sur les plateformes de cryptomonnaie qui exerçaient sans licence financière sur le marché boursier. Notre mission est de protéger les investisseurs, de leur offrir une seconde chance et de garantir une finance plus équitable grâce aux technologies blockchain et aux smart contracts.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Shield size={18} />, text: "Sécurité renforcée" },
                  { icon: <Globe size={18} />, text: "65+ pays couverts" },
                  { icon: <TrendingUp size={18} />, text: "Rendements optimisés" },
                  { icon: <Users size={18} />, text: "10 000+ clients satisfaits" },
                ].map(({ icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ color: "#225473", fontWeight: 600, fontSize: "0.9rem" }}>
                    <span style={{ color: "#f6a821" }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
              <Link href="/la-banque">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* About boxes */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Building2 size={28} />, title: "Banque Régulée", desc: "Agréée et supervisée par les autorités financières internationales AMF et SEC." },
              { icon: <Link2 size={28} />, title: "Technologie Blockchain", desc: "Utilisation de smart contracts transparents et immuables pour toutes les transactions." },
              { icon: <ShieldCheck size={28} />, title: "Sécurité Maximale", desc: "Protection avancée de vos données et actifs avec cryptage de niveau militaire." },
              { icon: <BarChart2 size={28} />, title: "Suivi en Temps Réel", desc: "Accédez à votre espace client 24h/24 et suivez l'évolution de vos investissements." },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "28px 22px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", borderTop: "4px solid #225473", textAlign: "center" }}>
                <div style={{ color: "#f6a821", marginBottom: "14px", display: "flex", justifyContent: "center" }}>{icon}</div>
                <h3 style={{ color: "#225473", fontWeight: 700, fontSize: "1rem", marginBottom: "10px" }}>{title}</h3>
                <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section style={{ background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Notre Mission</span>
              <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>Protéger et Rembourser les Victimes de Fraudes Crypto</h2>
              <p style={{ color: "#b8d4e8", lineHeight: 1.75, marginBottom: "20px" }}>
                Nous avons pour mission principale de lutter contre la fraude dans l'écosystème des cryptomonnaies en accompagnant les victimes dans leurs démarches de récupération de fonds.
              </p>
              <ul className="space-y-3">
                {[
                  "Audit des plateformes frauduleuses",
                  "Procédures légales et blockchain",
                  "Remboursements via smart contracts",
                  "Accompagnement personnalisé",
                  "Partenariats AMF, SEC et Interpol",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3" style={{ color: "#b8d4e8", fontSize: "0.95rem" }}>
                    <CheckCircle size={18} style={{ color: "#f6a821", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "65+", label: "Pays", icon: <Globe size={28} /> },
                { value: "10K+", label: "Clients", icon: <Users size={28} /> },
                { value: "50M+", label: "€ Remboursés", icon: <Banknote size={28} /> },
                { value: "98%", label: "Satisfaction", icon: <Star size={28} /> },
              ].map(({ value, label, icon }, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "28px 20px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ color: "#f6a821", display: "flex", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
                  <div style={{ color: "#f6a821", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: "#b8d4e8", fontSize: "0.9rem", marginTop: "6px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Ce que nous offrons</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 16px" }}>Nos Services</h2>
            <p style={{ color: "#777", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
              Découvrez l'ensemble de nos services conçus pour protéger vos investissements et vous accompagner dans l'univers des cryptomonnaies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon, title, desc, href }, i) => (
              <div key={i} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "32px 24px", transition: "all 0.3s", cursor: "pointer" }}
                className="hover:shadow-lg hover:border-[#225473]/30 group">
                <div style={{ color: "#225473", marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ color: "#225473", fontWeight: 700, fontSize: "1.05rem", marginBottom: "12px" }}>{title}</h3>
                <p style={{ color: "#777", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "20px" }}>{desc}</p>
                <Link href={href} style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem" }}
                  className="hover:underline flex items-center gap-1">
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert image + CTA */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Assistance</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>Parlez à l'un de nos agents spécialisés</h2>
              <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "24px" }}>
                Notre équipe d'experts est disponible pour vous guider, répondre à vos questions et vous accompagner dans toutes vos démarches liées aux cryptomonnaies et aux remboursements.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Support 24h/24", desc: "Nos agents sont disponibles à toute heure" },
                  { label: "Experts certifiés", desc: "Conseillers spécialisés en finance blockchain" },
                  { label: "Réponse rapide", desc: "Délai moyen de réponse inférieur à 2 heures" },
                ].map(({ label, desc }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} style={{ color: "#f6a821", marginTop: "2px", flexShrink: 0 }} />
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700, fontSize: "0.95rem" }}>{label}</div>
                      <div style={{ color: "#777", fontSize: "0.88rem" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Contacter un agent
                </button>
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <img src={expertImg} alt="Expert en crypto" style={{ width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "420px" }} />
              <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px", background: "rgba(34,84,115,0.92)", borderRadius: "10px", padding: "16px 20px", color: "white" }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[{ n: "65+", l: "Pays" }, { n: "10K+", l: "Clients" }, { n: "98%", l: "Satisfaits" }].map(({ n, l }, i) => (
                    <div key={i}>
                      <div style={{ color: "#f6a821", fontSize: "1.4rem", fontWeight: 800 }}>{n}</div>
                      <div style={{ color: "#b8d4e8", fontSize: "0.8rem" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#225473", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Témoignages</span>
            <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Ce que disent nos clients</h2>
            <p style={{ color: "#b8d4e8" }}>Satisfaits de nos services, ils nous ont laissé des avis...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(({ name, role, text }, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: "12px", padding: "28px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#f6a821" style={{ color: "#f6a821" }} />)}
                </div>
                <p style={{ color: "#b8d4e8", lineHeight: 1.75, marginBottom: "20px", fontStyle: "italic" }}>"{text}"</p>
                <div className="flex items-center gap-3">
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#f6a821", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700 }}>{name}</div>
                    <div style={{ color: "#b8d4e8", fontSize: "0.85rem" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "#f6a821", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 style={{ color: "white", fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Reprenez le contrôle de vos investissements !</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>Créez votre compte en quelques clics et commencez le processus de remboursement.</p>
            </div>
            <Link href="/ouverture-de-compte">
              <button style={{ background: "white", color: "#f6a821", border: "none", padding: "15px 35px", borderRadius: "6px", fontWeight: 800, fontSize: "1rem", cursor: "pointer", whiteSpace: "nowrap" }}
                className="hover:bg-gray-50 transition-colors">
                Créer mon compte maintenant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Register Form Section */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Rejoignez-nous</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>
                Ouvrez votre compte en toute simplicité
              </h2>
              <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "24px" }}>
                Accédez à notre plateforme sécurisée et commencez votre demande de remboursement en quelques minutes.
              </p>
              <div className="space-y-5 mb-8">
                {[
                  { step: "1", icon: <UserCheck size={18} />, title: "Créez votre compte", desc: "Remplissez le formulaire avec vos informations personnelles" },
                  { step: "2", icon: <FileCheck size={18} />, title: "Soumettez votre dossier", desc: "Fournissez les preuves de vos pertes et transactions" },
                  { step: "3", icon: <Wallet size={18} />, title: "Recevez votre remboursement", desc: "Récupérez vos fonds via blockchain en quelques jours" },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                      {step}
                    </div>
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#f6a821" }}>{icon}</span>
                        {title}
                      </div>
                      <div style={{ color: "#777", fontSize: "0.9rem" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <img src={tradingImg} alt="Trading" style={{ width: "100%", borderRadius: "12px", objectFit: "cover", maxHeight: "200px" }} />
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "36px" }}>
              <h3 style={{ color: "#225473", fontWeight: 800, fontSize: "1.3rem", marginBottom: "24px", textAlign: "center" }}>Créer mon compte</h3>
              <HomeRegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: "#225473", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "40px" }}>Banques partenaires</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partnerNames.map((name, i) => (
              <div key={i} style={{
                padding: "12px 28px", border: "1px solid #ddd", borderRadius: "8px",
                color: "#555", fontWeight: 700, fontSize: "1rem",
                background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
                className="hover:border-[#225473] hover:text-[#225473] transition-all">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function HomeRegisterForm() {
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
    width: "100%", padding: "10px 13px",
    border: `1px solid ${hasError ? "#dc3545" : "#ddd"}`,
    borderRadius: "6px", fontSize: "0.875rem", outline: "none", background: "white",
  });
  const lbl = { display: "block", color: "#444", fontWeight: 600, fontSize: "0.82rem", marginBottom: "4px" };
  const err = { color: "#dc3545", fontSize: "0.75rem", marginTop: "3px" };
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      {/* Civilité */}
      <div>
        <label style={lbl}>Civilité</label>
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
          <label style={lbl}>Nom *</label>
          <input type="text" placeholder="Dupont" {...form.register("lastName")} style={inp(!!errors.lastName)}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = errors.lastName ? "#dc3545" : "#ddd"} />
          {errors.lastName && <p style={err}>{errors.lastName.message}</p>}
        </div>
        <div>
          <label style={lbl}>Prénom *</label>
          <input type="text" placeholder="Jean" {...form.register("firstName")} style={inp(!!errors.firstName)}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = errors.firstName ? "#dc3545" : "#ddd"} />
          {errors.firstName && <p style={err}>{errors.firstName.message}</p>}
        </div>
      </div>
      {/* Email */}
      <div>
        <label style={lbl}>Adresse email *</label>
        <input type="email" placeholder="jean.dupont@email.com" autoComplete="email" {...form.register("email")} style={inp(!!errors.email)}
          onFocus={(e) => e.target.style.borderColor = "#225473"}
          onBlur={(e) => e.target.style.borderColor = errors.email ? "#dc3545" : "#ddd"} />
        {errors.email && <p style={err}>{errors.email.message}</p>}
      </div>
      {/* Téléphone / Pays */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={lbl}>Téléphone</label>
          <input type="tel" placeholder="+33 6 00 00 00 00" {...form.register("phone")} style={inp()}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"} />
        </div>
        <div>
          <label style={lbl}>Pays *</label>
          <select {...form.register("country")} style={inp(!!errors.country)}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = errors.country ? "#dc3545" : "#ddd"}>
            <option value="">— Sélectionner —</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p style={err}>{errors.country.message}</p>}
        </div>
      </div>
      {/* Mot de passe */}
      <div>
        <label style={lbl}>Mot de passe *</label>
        <div style={{ position: "relative" }}>
          <input type={showPassword ? "text" : "password"} placeholder="••••••••"
            {...form.register("password")} style={{ ...inp(!!errors.password), paddingRight: "40px" }}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = errors.password ? "#dc3545" : "#ddd"} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0" }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p style={err}>{errors.password.message}</p>}
        <p style={{ color: "#aaa", fontSize: "0.72rem", marginTop: "3px" }}>8 car. min., 1 majuscule, 1 chiffre</p>
      </div>
      {/* Confirmation */}
      <div>
        <label style={lbl}>Confirmer le mot de passe *</label>
        <div style={{ position: "relative" }}>
          <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
            {...form.register("confirmPassword")} style={{ ...inp(!!errors.confirmPassword), paddingRight: "40px" }}
            onFocus={(e) => e.target.style.borderColor = "#225473"}
            onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? "#dc3545" : "#ddd"} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0" }}>
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p style={err}>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={registerMutation.isPending}
        style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "13px", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", marginTop: "4px" }}
        className="hover:opacity-90 transition-opacity disabled:opacity-60">
        {registerMutation.isPending ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}
