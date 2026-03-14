import ServiceSidebar from "@/components/ServiceSidebar";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { TrendingUp, Clock, Banknote, Unlock, CheckCircle } from "lucide-react";
import { Link } from "wouter";


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
            {/* Sidebar */}
            <ServiceSidebar activeKey="staking" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
