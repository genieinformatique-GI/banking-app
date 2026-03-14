import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

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

export default function TaxeCrypto() {
  return (
    <PublicLayout>
      <PageTitle title="Taxe Cryto" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Taxe Crypto" }]} />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "16px" }}>Gestion des Taxes Crypto</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                La fiscalité des cryptomonnaies est un domaine complexe et en constante évolution. BOB vous offre un service complet de gestion fiscale pour vos actifs numériques, vous permettant de rester en conformité avec les réglementations tout en optimisant votre charge fiscale.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: "🧮", title: "Calcul automatique", desc: "Calcul automatisé de vos plus-values et obligations fiscales." },
                  { icon: "📄", title: "Déclaration simplifiée", desc: "Génération automatique de vos formulaires de déclaration fiscale." },
                  { icon: "⚖️", title: "Conformité légale", desc: "Respect des réglementations fiscales de votre pays de résidence." },
                  { icon: "💡", title: "Optimisation fiscale", desc: "Stratégies légales pour minimiser votre charge fiscale crypto." },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px", borderLeft: "4px solid #225473" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{icon}</div>
                    <h4 style={{ color: "#225473", fontWeight: 700, fontSize: "0.9rem", marginBottom: "6px" }}>{title}</h4>
                    <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f0f6fb", borderRadius: "10px", padding: "24px", marginBottom: "24px" }}>
                <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "12px" }}>Questions fréquentes sur la taxe crypto</h5>
                <div className="space-y-4">
                  {[
                    { q: "Comment sont imposées mes cryptomonnaies?", a: "En France, les plus-values sur la cession de crypto-actifs sont imposées à 30% (flat tax) ou au barème progressif de l'IR sur option." },
                    { q: "Dois-je déclarer mes cryptos même si je n'ai pas vendu?", a: "La simple détention de cryptomonnaies n'est pas imposable. L'imposition intervient uniquement lors de la conversion en monnaie fiat." },
                    { q: "Comment obtenir mon relevé fiscal?", a: "Notre plateforme génère automatiquement un relevé détaillé de toutes vos transactions, accessible depuis votre espace client." },
                  ].map(({ q, a }, i) => (
                    <div key={i}>
                      <strong style={{ color: "#225473", fontSize: "0.9rem" }}>{q}</strong>
                      <p style={{ color: "#666", fontSize: "0.88rem", marginTop: "4px", lineHeight: 1.65 }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "12px" }}>Gérez vos Taxes Crypto en toute simplicité!</h5>
              <p style={{ color: "#666", marginBottom: "20px" }}>Optimisez vos transactions, déclarez vos gains et évitez les mauvaises surprises fiscales. Inscrivez-vous dès aujourd'hui pour un suivi simplifié de vos obligations fiscales.</p>
              <Link href="/ouverture-de-compte">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }} className="hover:opacity-90 transition-opacity">🚀 Créer mon compte maintenant</button>
              </Link>
            </div>
            <ServiceSidebar active="/nos-services/taxe-crypto" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
