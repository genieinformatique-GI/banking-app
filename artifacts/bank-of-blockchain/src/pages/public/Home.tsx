import { useState, useEffect } from "react";
import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { CheckCircle, Shield, TrendingUp, Users, Globe, Star, ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    bg: "linear-gradient(135deg, #0f2940 0%, #225473 50%, #1a3d54 100%)",
    title: "Remboursement des Pertes en Cryptomonnaies",
    subtitle: "La Bank of Blockchain vous aide à récupérer vos fonds perdus sur des plateformes frauduleuses grâce à nos smart contracts et partenariats avec l'AMF et la SEC.",
    cta: { label: "Ouvrir mon compte de Remboursement", href: "/ouverture-de-compte" },
    cta2: { label: "En savoir plus", href: "/la-banque" },
  },
  {
    bg: "linear-gradient(135deg, #1a3020 0%, #2d5a3d 50%, #1e4a30 100%)",
    title: "Sécurisation & Protection de Vos Investissements",
    subtitle: "Nous mettons en place des mécanismes avancés de protection pour garantir la sécurité de vos actifs numériques et vous offrir la tranquillité d'esprit.",
    cta: { label: "Découvrir nos services", href: "/nos-services/securisation-des-investissements" },
    cta2: { label: "Nous contacter", href: "/contact" },
  },
];

const services = [
  { icon: "💰", title: "Remboursement des pertes", desc: "Récupérez vos fonds perdus sur des plateformes de crypto non réglementées grâce à nos procédures légales et blockchain.", href: "/nos-services/remboursement-des-pertes" },
  { icon: "🔒", title: "Sécurisation des investissements", desc: "Protégez vos actifs numériques avec nos solutions de sécurité avancées et nos smart contracts audités.", href: "/nos-services/securisation-des-investissements" },
  { icon: "🤝", title: "Conseil & accompagnement", desc: "Bénéficiez de l'expertise de nos conseillers spécialisés en cryptomonnaies et finance décentralisée.", href: "/nos-services/conseil-et-accompagnement" },
  { icon: "📈", title: "Services de staking", desc: "Faites fructifier vos cryptomonnaies grâce à nos services de staking sécurisés et rentables.", href: "/nos-services/services-de-staking" },
  { icon: "📋", title: "Licence de Trading", desc: "Obtenez votre licence de trading officielle pour exercer légalement sur les marchés de cryptomonnaies.", href: "/nos-services/licence-de-trading" },
  { icon: "🧾", title: "Taxe Crypto", desc: "Simplifiez vos obligations fiscales liées aux cryptomonnaies avec notre service de gestion fiscale automatisée.", href: "/nos-services/taxe-crypto" },
];

const testimonials = [
  { name: "Sophie", role: "Cliente", text: "Une solution unique et indispensable ! Enfin un service qui protège les investisseurs contre les arnaques et les faillites." },
  { name: "Léa", role: "Cliente", text: "Grâce à BOB, j'ai pu récupérer mes pertes rapidement et efficacement. Je recommande vivement leurs services." },
  { name: "Marc", role: "Client", text: "Le processus est simple, rapide et totalement sécurisé. J'ai récupéré mes pertes en quelques jours grâce à BOB." },
  { name: "Pierre", role: "Client", text: "J'étais sceptique au début, mais tout est transparent et automatisé via la blockchain. Une vraie révolution pour la protection des investisseurs !" },
];

const partners = [
  "https://bofblockchain.com/partners/ubs.png",
  "https://bofblockchain.com/partners/credit-suisse.png",
  "https://bofblockchain.com/partners/post-finance.png",
  "https://bofblockchain.com/partners/PIctet.png",
  "https://bofblockchain.com/partners/zkb.png",
  "https://bofblockchain.com/partners/unicredit.jpg",
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [testSlide, setTestSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const current = heroSlides[slide];

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section style={{ background: current.bg, transition: "background 0.8s ease", minHeight: "580px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)" }} />
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 style={{ color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.25, marginBottom: "20px" }}>
              {current.title}
            </h1>
            <p style={{ color: "#b8d4e8", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "32px" }}>
              {current.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={current.cta.href}>
                <button style={{ background: "#f6a821", color: "white", border: "none", padding: "14px 28px", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  {current.cta.label} →
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
        </div>
        {/* Slide controls */}
        <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: i === slide ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === slide ? "#f6a821" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
        <button onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          className="hover:bg-white/25 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          className="hover:bg-white/25 transition-colors">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* About Section */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <img src="https://bofblockchain.com/template/img/ICONE BLEU.png" alt="BOB Logo" style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <img src="https://bofblockchain.com/template/img/about-image/About 1.jpg" alt="About" style={{ width: "100%", borderRadius: "12px", objectFit: "cover", marginTop: "32px" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
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
                  { icon: <Shield size={20} />, text: "Sécurité renforcée" },
                  { icon: <Globe size={20} />, text: "65+ pays couverts" },
                  { icon: <TrendingUp size={20} />, text: "Rendements optimisés" },
                  { icon: <Users size={20} />, text: "10,000+ clients satisfaits" },
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
                  En savoir plus →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* About boxes */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏦", title: "Banque Régulée", desc: "Agréée et supervisée par les autorités financières internationales AMF et SEC." },
              { icon: "⛓️", title: "Technologie Blockchain", desc: "Utilisation de smart contracts transparents et immuables pour toutes les transactions." },
              { icon: "🔐", title: "Sécurité Maximale", desc: "Protection avancée de vos données et actifs avec cryptage de niveau militaire." },
              { icon: "📊", title: "Suivi en Temps Réel", desc: "Accédez à votre espace client 24h/24 et suivez l'évolution de vos investissements." },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "28px 22px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", borderTop: "4px solid #225473", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>{icon}</div>
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
                { value: "65+", label: "Pays", icon: "🌍" },
                { value: "10K+", label: "Clients", icon: "👥" },
                { value: "50M+", label: "€ Remboursés", icon: "💶" },
                { value: "98%", label: "Satisfaction", icon: "⭐" },
              ].map(({ value, label, icon }, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "28px 20px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>
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
                <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ color: "#225473", fontWeight: 700, fontSize: "1.05rem", marginBottom: "12px" }}>{title}</h3>
                <p style={{ color: "#777", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "20px" }}>{desc}</p>
                <Link href={href} style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem" }}
                  className="hover:underline flex items-center gap-1">
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Agent / CTA */}
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
                  Contacter un agent →
                </button>
              </Link>
            </div>
            <div style={{ background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
              <h3 style={{ color: "white", fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px" }}>Déposez votre demande</h3>
              <p style={{ color: "#b8d4e8", marginBottom: "24px", fontSize: "0.95rem", lineHeight: 1.65 }}>
                Remplissez notre formulaire en ligne et commencez votre procédure de remboursement dès aujourd'hui.
              </p>
              <Link href="/ouverture-de-compte">
                <button style={{ background: "#f6a821", color: "white", border: "none", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", width: "100%" }}
                  className="hover:opacity-90 transition-opacity">
                  Créer mon compte maintenant
                </button>
              </Link>
              <div className="mt-6 grid grid-cols-3 gap-4">
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
              <h2 style={{ color: "white", fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Reprenez le contrôle de vos investissements!</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>Créez votre compte en quelques clics et commencez le processus de remboursement.</p>
            </div>
            <Link href="/ouverture-de-compte">
              <button style={{ background: "white", color: "#f6a821", border: "none", padding: "15px 35px", borderRadius: "6px", fontWeight: 800, fontSize: "1rem", cursor: "pointer", whiteSpace: "nowrap" }}
                className="hover:bg-gray-50 transition-colors">
                Créer mon compte maintenant →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, marginBottom: "16px", lineHeight: 1.3 }}>Ouvrez votre compte en toute simplicité</h2>
              <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "24px" }}>
                Accédez à notre plateforme sécurisée et commencez votre demande de remboursement en quelques minutes.
              </p>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Créez votre compte", desc: "Remplissez le formulaire avec vos informations personnelles" },
                  { step: "2", title: "Soumettez votre dossier", desc: "Fournissez les preuves de vos pertes et transactions" },
                  { step: "3", title: "Recevez votre remboursement", desc: "Récupérez vos fonds via blockchain en quelques jours" },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                      {step}
                    </div>
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700 }}>{title}</div>
                      <div style={{ color: "#777", fontSize: "0.9rem" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "36px" }}>
              <h3 style={{ color: "#225473", fontWeight: 800, fontSize: "1.3rem", marginBottom: "24px", textAlign: "center" }}>Créer mon compte</h3>
              <QuickRegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: "#225473", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "40px" }}>Banques partenaires</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((src, i) => (
              <img key={i} src={src} alt="Partenaire" style={{ height: "50px", width: "auto", objectFit: "contain", filter: "grayscale(80%)", opacity: 0.7 }}
                className="hover:grayscale-0 hover:opacity-100 transition-all"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function QuickRegisterForm() {
  const [form, setForm] = useState({ civilite: "", nom: "", prenom: "", email: "", telephone: "" });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <select value={form.civilite} onChange={(e) => setForm({ ...form, civilite: e.target.value })}
        style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", color: "#555", background: "white" }}>
        <option value="">- Civilité -</option>
        <option value="M.">Monsieur</option>
        <option value="Mlle">Mademoiselle</option>
        <option value="Mme">Madame</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
          style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem" }} />
        <input type="text" placeholder="Prénom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem" }} />
      </div>
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem" }} />
      <input type="tel" placeholder="Téléphone portable" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
        style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem" }} />
      <a href="/ouverture-de-compte">
        <button type="button" style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: "8px" }}
          className="hover:opacity-90 transition-opacity">
          Créer mon compte →
        </button>
      </a>
    </form>
  );
}
