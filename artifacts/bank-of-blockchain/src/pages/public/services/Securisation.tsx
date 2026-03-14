import ServiceSidebar from "@/components/ServiceSidebar";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle, Shield, Lock, Eye, Zap } from "lucide-react";

export default function Securisation() {
  return (
    <PublicLayout>
      <PageTitle
        title="Sécurisation des investissements"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Sécurisation" }]}
      />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "16px" }}>Sécurisation de vos Investissements en Cryptomonnaies</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                Chez Blockchain Bank, nous mettons en place des mécanismes avancés de protection pour garantir la sécurité de vos actifs numériques. Notre approche multi-couches combine technologie blockchain, smart contracts audités et surveillance en temps réel.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: <Shield size={24} />, title: "Protection multi-couches", desc: "Plusieurs niveaux de sécurité pour vos actifs numériques." },
                  { icon: <Lock size={24} />, title: "Cryptage avancé", desc: "Vos données sont chiffrées avec les algorithmes les plus récents." },
                  { icon: <Eye size={24} />, title: "Surveillance 24/7", desc: "Monitoring continu de toutes vos transactions et actifs." },
                  { icon: <Zap size={24} />, title: "Réponse instantanée", desc: "Détection et blocage automatique des activités suspectes." },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px", borderLeft: "4px solid #225473" }}>
                    <div style={{ color: "#225473", marginBottom: "10px" }}>{icon}</div>
                    <h4 style={{ color: "#225473", fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>{title}</h4>
                    <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Nos solutions de sécurisation</h5>
              <ul className="space-y-3 mb-10">
                {[
                  "Audits de smart contracts par des experts indépendants",
                  "Stockage à froid (cold storage) pour les actifs importants",
                  "Authentification à deux facteurs (2FA) obligatoire",
                  "Assurance des actifs numériques jusqu'à 5M€",
                  "Surveillance des transactions en temps réel avec IA",
                  "Conformité avec les standards ISO 27001 et SOC 2",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <CheckCircle size={16} style={{ color: "#f6a821", flexShrink: 0, marginTop: "2px" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/ouverture-de-compte">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Sécuriser mes investissements →
                </button>
              </Link>
            </div>
            {/* Sidebar */}
            <ServiceSidebar activeKey="securisation" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
