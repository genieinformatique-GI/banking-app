import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function Partenariats() {
  return (
    <PublicLayout>
      <PageTitle
        title="Partenariats AMF et SEC"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Partenariats AMF et SEC" }]}
      />

      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Régulation & Conformité</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 16px" }}>Nos Partenariats avec l'AMF et la SEC</h2>
            <p style={{ color: "#777", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
              La Bank of Blockchain opère en totale conformité avec les réglementations financières internationales grâce à ses partenariats officiels avec l'AMF et la SEC.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                flag: "🇫🇷",
                org: "AMF",
                name: "Autorité des Marchés Financiers",
                country: "France",
                desc: "L'AMF est le régulateur français des marchés financiers. Notre partenariat avec l'AMF garantit que toutes nos opérations en France et dans l'Union Européenne respectent les strictes réglementations en matière de protection des investisseurs et de lutte contre la fraude.",
                points: [
                  "Agrément officiel pour les opérations de remboursement",
                  "Surveillance continue de nos activités",
                  "Coopération dans les enquêtes anti-fraude",
                  "Garantie de conformité RGPD",
                ],
              },
              {
                flag: "🇺🇸",
                org: "SEC",
                name: "Securities and Exchange Commission",
                country: "États-Unis",
                desc: "La SEC est le principal régulateur des marchés financiers américains. Notre collaboration avec la SEC nous permet d'opérer légalement sur les marchés nord-américains et d'offrir une protection maximale à nos clients investisseurs.",
                points: [
                  "Enregistrement officiel auprès de la SEC",
                  "Conformité aux réglementations américaines",
                  "Accès aux bases de données de fraude",
                  "Support juridique international",
                ],
              },
            ].map(({ flag, org, name, country, desc, points }, i) => (
              <div key={i} style={{ border: "1px solid #eee", borderRadius: "16px", padding: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div style={{ fontSize: "3rem" }}>{flag}</div>
                  <div>
                    <div style={{ color: "#225473", fontWeight: 800, fontSize: "1.5rem" }}>{org}</div>
                    <div style={{ color: "#777", fontSize: "0.9rem" }}>{name} — {country}</div>
                  </div>
                </div>
                <p style={{ color: "#555", lineHeight: 1.75, marginBottom: "20px", fontSize: "0.95rem" }}>{desc}</p>
                <ul className="space-y-3">
                  {points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3" style={{ color: "#555", fontSize: "0.9rem" }}>
                      <CheckCircle size={16} style={{ color: "#f6a821", marginTop: "2px", flexShrink: 0 }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Why it matters */}
          <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "48px" }}>
            <h3 style={{ color: "#225473", fontSize: "1.5rem", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>
              Pourquoi ces partenariats sont importants pour vous?
            </h3>
            <p style={{ color: "#777", lineHeight: 1.75, textAlign: "center", marginBottom: "36px", maxWidth: "600px", margin: "0 auto 36px" }}>
              Ces collaborations officielles nous donnent accès à des ressources uniques pour récupérer vos fonds et poursuivre les plateformes frauduleuses.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "⚖️", title: "Recours légaux", desc: "Nos partenariats nous permettent d'engager des procédures légales dans plus de 65 pays." },
                { icon: "🔍", title: "Traçabilité", desc: "Nous avons accès aux outils de traçabilité des transactions blockchain les plus avancés." },
                { icon: "💰", title: "Remboursements", desc: "Des canaux officiels garantissent que vos remboursements arrivent rapidement et en toute sécurité." },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} style={{ background: "white", borderRadius: "12px", padding: "24px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>{icon}</div>
                  <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "8px" }}>{title}</h4>
                  <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/ouverture-de-compte">
              <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                className="hover:opacity-90 transition-opacity">
                Déposer ma demande de remboursement →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
