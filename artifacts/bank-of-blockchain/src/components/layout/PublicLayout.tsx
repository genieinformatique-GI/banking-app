import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Mail, X, Menu } from "lucide-react";
import logo from "@assets/logo_1773450356780.jpg";

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [pourquoiOpen, setPourquoiOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: "#225473", color: "white", fontSize: "13px" }}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-6">
              <Link href="/ouverture-de-compte" className="hover:text-yellow-300 transition-colors font-medium">
                Activation de compte
              </Link>
              <Link href="/espace-client" className="hover:text-yellow-300 transition-colors font-medium">
                Espace client
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>Écrivez-nous:</span>
                <a href="mailto:infos@bofblockchain.com" className="hover:text-yellow-300 transition-colors">
                  infos@bofblockchain.com
                </a>
              </div>
              <Link href="/contact">
                <button
                  style={{ background: "#f6a821", color: "white", border: "none" }}
                  className="px-4 py-1.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Discuter avec un agent
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div style={{ background: "white", boxShadow: "0 2px 15px rgba(0,0,0,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <img
                src={logo}
                alt="Bank of Blockchain"
                style={{ height: "52px", width: "auto", objectFit: "contain" }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "/", label: "Accueil" },
                { href: "/la-banque", label: "La Banque" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 text-sm font-semibold transition-colors rounded"
                  style={{ color: location === href ? "#225473" : "#444", borderBottom: location === href ? "2px solid #225473" : "2px solid transparent" }}
                >
                  {label}
                </Link>
              ))}

              {/* Nos Services Dropdown */}
              <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#225473] transition-colors rounded">
                  Nos Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                {servicesOpen && (
                  <div style={{ background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #eee" }}
                    className="absolute top-full left-0 min-w-[260px] rounded-md z-50 py-2">
                    {[
                      { href: "/nos-services/remboursement-des-pertes", label: "Remboursement des pertes" },
                      { href: "/nos-services/securisation-des-investissements", label: "Sécurisation des investissements" },
                      { href: "/nos-services/conseil-et-accompagnement", label: "Conseil et accompagnement" },
                      { href: "/nos-services/services-de-staking", label: "Services de staking" },
                      { href: "/nos-services/licence-de-trading", label: "Licence de Trading" },
                      { href: "/nos-services/taxe-crypto", label: "Taxe Crypto" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-[#225473] hover:text-white transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Pourquoi Nous Choisir Dropdown */}
              <div className="relative" onMouseEnter={() => setPourquoiOpen(true)} onMouseLeave={() => setPourquoiOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#225473] transition-colors rounded">
                  Pourquoi Nous Choisir <ChevronDown size={14} className={`transition-transform ${pourquoiOpen ? "rotate-180" : ""}`} />
                </button>
                {pourquoiOpen && (
                  <div style={{ background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #eee" }}
                    className="absolute top-full left-0 min-w-[300px] rounded-md z-50 py-2">
                    {[
                      { href: "/engagement-securite-et-transparence", label: "Engagement envers la sécurité et la transparence" },
                      { href: "/partenariats-amf-sec", label: "Partenariats AMF et SEC" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-[#225473] hover:text-white transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/nos-services/assurance-crypto"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#225473] transition-colors rounded">
                Assurance crypto
              </Link>
              <Link href="/nos-services/faqs"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#225473] transition-colors rounded">
                FAQs
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} style={{ color: "#225473" }} /> : <Menu size={24} style={{ color: "#225473" }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "white", borderTop: "1px solid #eee" }} className="lg:hidden">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {[
                { href: "/", label: "Accueil" },
                { href: "/la-banque", label: "La Banque" },
                { href: "/nos-services/remboursement-des-pertes", label: "→ Remboursement des pertes" },
                { href: "/nos-services/securisation-des-investissements", label: "→ Sécurisation des investissements" },
                { href: "/nos-services/conseil-et-accompagnement", label: "→ Conseil et accompagnement" },
                { href: "/nos-services/services-de-staking", label: "→ Services de staking" },
                { href: "/nos-services/licence-de-trading", label: "→ Licence de Trading" },
                { href: "/nos-services/taxe-crypto", label: "→ Taxe Crypto" },
                { href: "/engagement-securite-et-transparence", label: "→ Engagement sécurité & transparence" },
                { href: "/partenariats-amf-sec", label: "→ Partenariats AMF et SEC" },
                { href: "/nos-services/assurance-crypto", label: "Assurance crypto" },
                { href: "/nos-services/faqs", label: "FAQs" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#225473] rounded transition-colors">
                  {label}
                </Link>
              ))}
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
    <footer style={{ background: "#1a1a2e", color: "#ccc", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Newsletter */}
      <div style={{ background: "#225473" }} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Newsletter</h2>
              <p className="text-blue-100 text-sm">Inscrivez-vous et recevez chaque semaine nos meilleures offres bancaires par e-mail.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse e-mail"
                className="flex-1 lg:w-72 px-4 py-3 rounded text-gray-900 text-sm focus:outline-none"
                style={{ border: "none" }}
              />
              <button
                type="submit"
                style={{ background: "#f6a821", color: "white", border: "none" }}
                className="px-5 py-3 rounded font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                Souscrire maintenant →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src={logo}
              alt="Bank of Blockchain"
              style={{ height: "44px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: "16px" }}
            />
            <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.7" }}>
              Depuis plusieurs années, nous proposons à nos internautes nos meilleures offres de financement. Une solution pour chaque situation.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-5">Liens Utiles</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Accueil" },
                { href: "/la-banque", label: "Qui sommes-nous" },
                { href: "/nos-services/assurance-crypto", label: "Assurance Crypto" },
                { href: "/nos-services/remboursement-des-pertes", label: "Nos services" },
                { href: "/contact", label: "Nous contacter" },
                { href: "/nos-services/faqs", label: "Faqs" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: "#aaa", fontSize: "14px" }}
                    className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-5">Informations de contact</h3>
            <ul className="space-y-4" style={{ color: "#aaa", fontSize: "14px" }}>
              <li>
                <span className="text-white font-semibold">Localisation:</span>
                <br />ECB Tower, Sonnemannstraße 20, 60314 Frankfurt am Main, Allemagne
              </li>
              <li>
                <span className="text-white font-semibold">Email:</span>
                <br />
                <a href="mailto:infos@bofblockchain.com" className="hover:text-white transition-colors">
                  infos@bofblockchain.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: "1px solid #333" }} className="py-5">
        <div className="max-w-6xl mx-auto px-6">
          <p style={{ color: "#888", fontSize: "13px" }}>
            <Link href="/" className="hover:text-white transition-colors">© Bank of Blockchain</Link>, 2024 - Tous Droits Réservés
          </p>
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

// Reusable page title section matching the real site's page-title-area style
export function PageTitle({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string; href?: string }[] }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)", padding: "80px 0", textAlign: "center" }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <ul className="flex items-center justify-center gap-2 text-sm" style={{ color: "#b8d4e8" }}>
          {breadcrumbs.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span style={{ color: "#f6a821" }}>›</span>}
              {b.href ? (
                <Link href={b.href} className="hover:text-white transition-colors">{b.label}</Link>
              ) : (
                <span className="text-white">{b.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
