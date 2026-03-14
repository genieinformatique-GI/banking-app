import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Mail, X, Menu, MapPin, Shield, TrendingUp, FileText, Receipt, Lock, Handshake } from "lucide-react";
import logo from "@assets/logo.jpg";

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [pourquoiOpen, setPourquoiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location === href;

  return (
    <header style={{ fontFamily: "'Open Sans', sans-serif", position: "sticky", top: 0, zIndex: 1000 }}>
      {/* Top bar */}
      <div style={{ background: "#070e1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Mail size={12} style={{ color: "#f6a821" }} />
                <a href="mailto:infos@bofblockchain.com"
                  style={{ color: "#8899b0", fontSize: "12px" }}
                  className="hover:text-white transition-colors">
                  infos@bofblockchain.com
                </a>
              </div>
              <span style={{ color: "#1e3a5f", fontSize: "12px" }}>|</span>
              <Link href="/ouverture-de-compte"
                style={{ color: "#8899b0", fontSize: "12px" }}
                className="hover:text-[#f6a821] transition-colors">
                Activation de compte
              </Link>
              <Link href="/espace-client"
                style={{ color: "#8899b0", fontSize: "12px" }}
                className="hover:text-[#f6a821] transition-colors">
                Espace client
              </Link>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/contact">
                <button style={{
                  background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                  color: "white", border: "none", padding: "5px 16px",
                  borderRadius: "4px", fontSize: "11px", fontWeight: "700",
                  cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase"
                }}>
                  Discuter avec un agent
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{
        background: scrolled ? "rgba(255,255,255,0.98)" : "white",
        backdropFilter: "blur(20px)",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.12)" : "0 2px 20px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: "76px" }}>
            <Link href="/">
              <img src={logo} alt="Bank of Blockchain"
                style={{ height: "50px", width: "auto", objectFit: "contain" }} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {[
                { href: "/", label: "Accueil" },
                { href: "/la-banque", label: "La Banque" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  style={{
                    padding: "8px 14px", fontSize: "14px", fontWeight: "600",
                    color: isActive(href) ? "#225473" : "#374151",
                    borderBottom: isActive(href) ? "2px solid #f6a821" : "2px solid transparent",
                    transition: "all 0.2s", display: "block"
                  }}
                  className="hover:text-[#225473]">
                  {label}
                </Link>
              ))}

              {/* Services dropdown */}
              <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button style={{
                  display: "flex", alignItems: "center", gap: "4px", padding: "8px 14px",
                  fontSize: "14px", fontWeight: "600", color: "#374151",
                  background: "none", border: "none", cursor: "pointer",
                  borderBottom: "2px solid transparent"
                }} className="hover:text-[#225473]">
                  Nos Services
                  <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {servicesOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
                    background: "white", minWidth: "290px", borderRadius: "14px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.15)", border: "1px solid #f0f4f8",
                    padding: "10px", zIndex: 200,
                  }}>
                    <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid #f0f4f8", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#f6a821", letterSpacing: "1px", textTransform: "uppercase" }}>Nos Services</span>
                    </div>
                    {[
                      { href: "/nos-services/remboursement-des-pertes", label: "Remboursement des pertes", icon: <Handshake size={15} /> },
                      { href: "/nos-services/securisation-des-investissements", label: "Sécurisation des investissements", icon: <Lock size={15} /> },
                      { href: "/nos-services/conseil-et-accompagnement", label: "Conseil et accompagnement", icon: <Shield size={15} /> },
                      { href: "/nos-services/services-de-staking", label: "Services de staking", icon: <TrendingUp size={15} /> },
                      { href: "/nos-services/licence-de-trading", label: "Licence de Trading", icon: <FileText size={15} /> },
                      { href: "/nos-services/taxe-crypto", label: "Taxe Crypto", icon: <Receipt size={15} /> },
                    ].map(({ href, label, icon }) => (
                      <Link key={href} href={href}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
                          borderRadius: "9px", color: "#374151", fontSize: "13.5px", textDecoration: "none"
                        }}
                        className="hover:bg-blue-50 hover:text-[#225473] transition-colors">
                        <span style={{ color: "#f6a821", width: "20px", flexShrink: 0 }}>{icon}</span>
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Pourquoi dropdown */}
              <div className="relative" onMouseEnter={() => setPourquoiOpen(true)} onMouseLeave={() => setPourquoiOpen(false)}>
                <button style={{
                  display: "flex", alignItems: "center", gap: "4px", padding: "8px 14px",
                  fontSize: "14px", fontWeight: "600", color: "#374151",
                  background: "none", border: "none", cursor: "pointer",
                  borderBottom: "2px solid transparent"
                }} className="hover:text-[#225473]">
                  Pourquoi Nous
                  <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: pourquoiOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {pourquoiOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
                    background: "white", minWidth: "300px", borderRadius: "14px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.15)", border: "1px solid #f0f4f8",
                    padding: "10px", zIndex: 200,
                  }}>
                    {[
                      { href: "/engagement-securite-et-transparence", label: "Engagement envers la sécurité et la transparence" },
                      { href: "/partenariats-amf-sec", label: "Partenariats avec l'AMF et la SEC" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href}
                        style={{ display: "block", padding: "11px 14px", borderRadius: "9px", color: "#374151", fontSize: "13.5px" }}
                        className="hover:bg-blue-50 hover:text-[#225473] transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/nos-services/assurance-crypto"
                style={{ padding: "8px 14px", fontSize: "14px", fontWeight: "600", color: "#374151", borderBottom: "2px solid transparent", display: "block" }}
                className="hover:text-[#225473]">
                Assurance crypto
              </Link>
              <Link href="/nos-services/faqs"
                style={{ padding: "8px 14px", fontSize: "14px", fontWeight: "600", color: "#374151", borderBottom: "2px solid transparent", display: "block" }}
                className="hover:text-[#225473]">
                FAQs
              </Link>
            </nav>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/espace-client">
                <button
                  style={{
                    padding: "9px 22px", fontSize: "13px", fontWeight: "600",
                    border: "2px solid #225473", color: "#225473", background: "transparent",
                    borderRadius: "8px", cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.background = "#225473";
                    el.style.color = "white";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.background = "transparent";
                    el.style.color = "#225473";
                  }}>
                  Se connecter
                </button>
              </Link>
              <Link href="/ouverture-de-compte">
                <button style={{
                  padding: "9px 22px", fontSize: "13px", fontWeight: "700",
                  background: "linear-gradient(135deg, #f6a821 0%, #d4891a 100%)",
                  border: "none", color: "white", borderRadius: "8px",
                  cursor: "pointer", boxShadow: "0 4px 15px rgba(246,168,33,0.35)"
                }}>
                  Ouvrir un compte
                </button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} style={{ color: "#225473" }} /> : <Menu size={24} style={{ color: "#225473" }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#070e1a", borderTop: "1px solid #1a2e4a" }}>
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
              {[
                { href: "/", label: "Accueil" },
                { href: "/la-banque", label: "La Banque" },
                { href: "/nos-services/remboursement-des-pertes", label: "Remboursement des pertes" },
                { href: "/nos-services/securisation-des-investissements", label: "Sécurisation des investissements" },
                { href: "/nos-services/conseil-et-accompagnement", label: "Conseil et accompagnement" },
                { href: "/nos-services/services-de-staking", label: "Services de staking" },
                { href: "/nos-services/licence-de-trading", label: "Licence de Trading" },
                { href: "/nos-services/taxe-crypto", label: "Taxe Crypto" },
                { href: "/engagement-securite-et-transparence", label: "Sécurité & transparence" },
                { href: "/partenariats-amf-sec", label: "Partenariats AMF & SEC" },
                { href: "/nos-services/assurance-crypto", label: "Assurance crypto" },
                { href: "/nos-services/faqs", label: "FAQs" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "10px 14px", color: "#8899b0", fontSize: "14px", borderRadius: "8px" }}
                  className="hover:bg-[#1a2e4a] hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
              <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: "1px solid #1a2e4a" }}>
                <Link href="/espace-client" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button style={{ width: "100%", padding: "11px", background: "transparent", border: "1px solid #225473", color: "#8899b0", borderRadius: "8px", fontSize: "14px" }}>
                    Se connecter
                  </button>
                </Link>
                <Link href="/ouverture-de-compte" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button style={{ width: "100%", padding: "11px", background: "#f6a821", border: "none", color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "700" }}>
                    Ouvrir un compte
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function PublicFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ background: "#070e1a", color: "#8899b0", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Newsletter */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d54 0%, #225473 50%, #1a3d54 100%)",
        padding: "64px 0", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: "-80px", top: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(246,168,33,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-60px", bottom: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(246,168,33,0.05)", pointerEvents: "none" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div style={{ color: "#f6a821", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Newsletter</div>
              <h2 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "8px", lineHeight: 1.3 }}>
                Restez informé de nos actualités
              </h2>
              <p style={{ color: "#b8d4e8", fontSize: "14px" }}>
                Recevez chaque semaine nos meilleures offres et conseils en crypto-finance.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", borderRadius: "10px", overflow: "hidden", width: "100%", maxWidth: "480px", boxShadow: "0 10px 40px rgba(0,0,0,0.25)" }}>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                style={{ flex: 1, padding: "15px 20px", border: "none", outline: "none", fontSize: "14px", background: "white", color: "#1a2637" }}
              />
              <button type="submit" style={{
                padding: "15px 28px", background: "#f6a821",
                color: "white", border: "none", fontWeight: "700", fontSize: "14px",
                cursor: "pointer", whiteSpace: "nowrap"
              }}>
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div style={{ padding: "72px 0 48px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 14px", marginBottom: "22px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={logo} alt="Bank of Blockchain"
                  style={{ height: "38px", width: "auto", objectFit: "contain", display: "block" }} />
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#64748b", marginBottom: "24px" }}>
                Bank of Blockchain protège et accompagne les investisseurs en cryptomonnaies partout dans le monde, grâce à nos partenariats AMF & SEC.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["AMF", "SEC", "ISO 27001"].map(cert => (
                  <div key={cert} style={{
                    padding: "4px 10px", background: "#0f1e35",
                    border: "1px solid #1e3a5f", borderRadius: "4px",
                    color: "#8899b0", fontSize: "11px", fontWeight: "700"
                  }}>
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "22px", paddingBottom: "12px", borderBottom: "2px solid #f6a821", display: "inline-block" }}>
                Nos Services
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {[
                  { href: "/nos-services/remboursement-des-pertes", label: "Remboursement des pertes" },
                  { href: "/nos-services/securisation-des-investissements", label: "Sécurisation des investissements" },
                  { href: "/nos-services/conseil-et-accompagnement", label: "Conseil & accompagnement" },
                  { href: "/nos-services/services-de-staking", label: "Services de staking" },
                  { href: "/nos-services/licence-de-trading", label: "Licence de Trading" },
                  { href: "/nos-services/taxe-crypto", label: "Taxe Crypto" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                      style={{ color: "#64748b", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px" }}
                      className="hover:text-[#f6a821] transition-colors">
                      <span style={{ color: "#f6a821", fontSize: "9px" }}>▶</span> {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liens utiles */}
            <div>
              <h3 style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "22px", paddingBottom: "12px", borderBottom: "2px solid #f6a821", display: "inline-block" }}>
                Liens Utiles
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {[
                  { href: "/", label: "Accueil" },
                  { href: "/la-banque", label: "Qui sommes-nous" },
                  { href: "/engagement-securite-et-transparence", label: "Engagement & sécurité" },
                  { href: "/partenariats-amf-sec", label: "Partenariats AMF & SEC" },
                  { href: "/nos-services/assurance-crypto", label: "Assurance Crypto" },
                  { href: "/nos-services/faqs", label: "FAQs" },
                  { href: "/contact", label: "Nous contacter" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                      style={{ color: "#64748b", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px" }}
                      className="hover:text-[#f6a821] transition-colors">
                      <span style={{ color: "#f6a821", fontSize: "9px" }}>▶</span> {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "22px", paddingBottom: "12px", borderBottom: "2px solid #f6a821", display: "inline-block" }}>
                Contact
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
                <li style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <MapPin size={16} style={{ color: "#f6a821", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "#64748b", fontSize: "13.5px", lineHeight: "1.7" }}>
                    ECB Tower, Sonnemannstraße 20,<br />60314 Frankfurt am Main, Allemagne
                  </span>
                </li>
                <li style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <Mail size={16} style={{ color: "#f6a821", flexShrink: 0 }} />
                  <a href="mailto:infos@bofblockchain.com"
                    style={{ color: "#64748b", fontSize: "13.5px" }}
                    className="hover:text-[#f6a821] transition-colors">
                    infos@bofblockchain.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #0f1e35", padding: "22px 0" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: "#374151", fontSize: "13px" }}>
            © 2024 <Link href="/" className="hover:text-white transition-colors" style={{ color: "#64748b" }}>Bank of Blockchain</Link> — Tous droits réservés
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { href: "/contact", label: "Mentions légales" },
              { href: "/contact", label: "Politique de confidentialité" },
              { href: "/contact", label: "CGU" },
            ].map(({ href, label }) => (
              <Link key={label} href={href}
                style={{ color: "#374151", fontSize: "12px" }}
                className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Open Sans', sans-serif" }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

export function PageTitle({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string; href?: string }[] }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #070e1a 0%, #0f2040 50%, #1a3d54 100%)",
      padding: "90px 0 80px", textAlign: "center", position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(246,168,33,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(34,84,115,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
        <h1 style={{ fontSize: "38px", fontWeight: "800", color: "white", marginBottom: "18px", letterSpacing: "-0.5px" }}>{title}</h1>
        <ul style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
          {breadcrumbs.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {i > 0 && <span style={{ color: "#f6a821", fontSize: "16px" }}>›</span>}
              {b.href ? (
                <Link href={b.href} style={{ color: "#b8d4e8", fontSize: "14px" }} className="hover:text-white transition-colors">{b.label}</Link>
              ) : (
                <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{b.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
