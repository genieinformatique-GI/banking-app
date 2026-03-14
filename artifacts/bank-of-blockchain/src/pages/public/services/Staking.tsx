import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { TrendingUp, Clock, Banknote, Unlock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

const ServiceSidebar = ({ active }: { active: string }) => (
  <div>
    <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "28px", marginBottom: "20px" }}>
      <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Nos services</h4>
      <ul className="space-y-2">
        {[
          { label: "Remboursement des pertes", href: "/nos-services/remboursement-des-pertes" },
          { label: "Sécurisation des investissements", href: "/nos-services/securisation-des-investissements" },
          { label: "Conseil et accompagnement", href: "/nos-services/conseil-et-accompagnement" },
          { label: "Services de staking", href: "/nos-services/services-de-staking" },
          { label: "Licence de Trading", href: "/nos-services/licence-de-trading" },
          { label: "Taxe Crypto", href: "/nos-services/taxe-crypto" },
        ].map(({ label, href }) => {
          const isActive = href === active;
          return <li key={href}><Link href={href} style={{ display: "block", padding: "10px 14px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: isActive ? 700 : 500, background: isActive ? "#225473" : "transparent", color: isActive ? "white" : "#555" }} className={isActive ? "" : "hover:bg-gray-200 transition-colors"}>{label}</Link></li>;
        })}
      </ul>
    </div>
    <div style={{ background: "#225473", borderRadius: "12px", padding: "28px", color: "white", textAlign: "center" }}>
      <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Besoin d'aide?</h4>
      <p style={{ color: "#b8d4e8", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.6 }}>Contactez un conseiller BOB pour être guidé dans votre démarche.</p>
      <Link href="/contact"><button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 20px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", width: "100%", fontSize: "0.9rem" }} className="hover:opacity-90 transition-opacity">Nous contacter</button></Link>
    </div>
  </div>
);

export default function Staking() {
  return (
    <PublicLayout>
      <PageTitle title="Staking Sécurisé" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Services de staking" }]} />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "16px" }}>Services de Staking Sécurisé</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                Le staking est l'une des méthodes les plus sûres pour faire fructifier vos cryptomonnaies. BOB vous offre un service de staking sécurisé avec des rendements optimisés et une transparence totale.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { value: "Jusqu'à 12%", label: "APY moyen", icon: <TrendingUp size={26} /> },
                  { value: "Flexible", label: "Durées de staking", icon: <Clock size={26} /> },
                  { value: "Quotidien", label: "Versement des gains", icon: <Banknote size={26} /> },
                  { value: "Immédiat", label: "Retrait possible", icon: <Unlock size={26} /> },
                ].map(({ value, label, icon }, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px", textAlign: "center", borderTop: "3px solid #225473" }}>
                    <div style={{ color: "#225473", display: "flex", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
                    <div style={{ color: "#f6a821", fontSize: "1.3rem", fontWeight: 800 }}>{value}</div>
                    <div style={{ color: "#666", fontSize: "0.85rem", marginTop: "4px" }}>{label}</div>
                  </div>
                ))}
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Cryptomonnaies disponibles pour le staking</h5>
              <ul className="space-y-3 mb-10">
                {[
                  "Bitcoin (BTC) – Jusqu'à 6% APY",
                  "Ethereum (ETH) – Jusqu'à 8% APY",
                  "Solana (SOL) – Jusqu'à 12% APY",
                  "Cardano (ADA) – Jusqu'à 10% APY",
                  "Polygon (MATIC) – Jusqu'à 9% APY",
                  "USDT/USDC – Jusqu'à 7% APY",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <CheckCircle size={16} style={{ color: "#f6a821", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/ouverture-de-compte">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }} className="hover:opacity-90 transition-opacity">Commencer le staking →</button>
              </Link>
            </div>
            <ServiceSidebar active="/nos-services/services-de-staking" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
