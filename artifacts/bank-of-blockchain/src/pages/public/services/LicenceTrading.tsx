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

export default function LicenceTrading() {
  return (
    <PublicLayout>
      <PageTitle title="Licence de trading" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Licence de Trading" }]} />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "16px" }}>Obtenez votre Licence de Trading</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                Pour exercer légalement sur les marchés de cryptomonnaies, il est indispensable de disposer des licences et agréments appropriés. BOB vous accompagne dans l'obtention de votre licence de trading officielle.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { step: "1", title: "Évaluation de votre profil", desc: "Nos experts analysent vos besoins et vous orientent vers la licence la plus adaptée à votre activité de trading." },
                  { step: "2", title: "Constitution du dossier", desc: "Nous vous aidons à préparer tous les documents nécessaires (KYC, AML, business plan, preuves de fonds)." },
                  { step: "3", title: "Soumission aux autorités", desc: "Votre dossier est soumis aux autorités compétentes (AMF, SEC, FCA, etc.) selon votre pays d'activité." },
                  { step: "4", title: "Obtention de la licence", desc: "Une fois approuvé, vous recevez votre licence officielle et pouvez exercer légalement." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start" style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>{step}</div>
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700, marginBottom: "4px" }}>{title}</div>
                      <div style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Types de licences disponibles</h5>
              <ul className="space-y-3 mb-10">
                {["Licence de Prestataire de Services sur Actifs Numériques (PSAN – France)", "Broker-Dealer License (SEC – USA)", "Virtual Asset Service Provider (VASP – Europe)", "Financial Conduct Authority Registration (FCA – UK)", "Licence pour fonds d'investissement crypto"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: "#555", fontSize: "0.95rem" }}><CheckCircle size={16} style={{ color: "#f6a821", flexShrink: 0, marginTop: "2px" }} />{item}</li>
                ))}
              </ul>

              <Link href="/contact">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }} className="hover:opacity-90 transition-opacity">Demander ma licence →</button>
              </Link>
            </div>
            <ServiceSidebar active="/nos-services/licence-de-trading" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
