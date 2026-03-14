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
          return (
            <li key={href}><Link href={href} style={{ display: "block", padding: "10px 14px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: isActive ? 700 : 500, background: isActive ? "#225473" : "transparent", color: isActive ? "white" : "#555" }} className={isActive ? "" : "hover:bg-gray-200 transition-colors"}>{label}</Link></li>
          );
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

export default function Conseil() {
  return (
    <PublicLayout>
      <PageTitle title="Conseil et accompagnement" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Conseil et accompagnement" }]} />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "16px" }}>Conseil & Accompagnement Personnalisé</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>Nos experts vous accompagnent à chaque étape de votre parcours dans l'univers des cryptomonnaies. Que vous soyez débutant ou investisseur expérimenté, nous avons la solution adaptée à vos besoins.</p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: "👨‍💼", title: "Conseiller dédié", desc: "Un expert BOB vous est assigné personnellement pour suivre votre dossier et répondre à toutes vos questions." },
                  { icon: "📊", title: "Analyse de portefeuille", desc: "Évaluation complète de vos investissements actuels et recommandations pour optimiser votre stratégie crypto." },
                  { icon: "⚖️", title: "Accompagnement légal", desc: "Nos juristes spécialisés vous guident dans toutes les démarches légales liées à vos investissements en cryptomonnaies." },
                  { icon: "🎓", title: "Formation & Education", desc: "Programmes de formation pour comprendre la blockchain, les cryptomonnaies et les meilleures pratiques d'investissement." },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "2rem", flexShrink: 0 }}>{icon}</div>
                    <div>
                      <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "6px" }}>{title}</h4>
                      <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f0f6fb", borderRadius: "10px", padding: "24px", marginBottom: "24px" }}>
                <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "12px" }}>Questions fréquentes sur le conseil</h5>
                <div className="space-y-3">
                  {[
                    { q: "Qui peut bénéficier du service de conseil?", a: "Toute personne physique ou morale souhaitant investir, gérer ou récupérer des actifs en cryptomonnaies." },
                    { q: "Proposez-vous des conseils pour les entreprises?", a: "Oui, nous accompagnons aussi les entreprises et institutions souhaitant intégrer la blockchain dans leur activité." },
                    { q: "Comment puis-je accéder au service de conseil?", a: "Il suffit de créer un compte sur BOB et de prendre rendez-vous avec l'un de nos experts." },
                  ].map(({ q, a }, i) => (
                    <div key={i}>
                      <strong style={{ color: "#225473", fontSize: "0.9rem" }}>{q}</strong>
                      <p style={{ color: "#666", fontSize: "0.88rem", marginTop: "4px" }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "12px" }}>Prenez le contrôle de vos investissements!</h5>
              <p style={{ color: "#666", marginBottom: "20px" }}>Bénéficiez d'un accompagnement sur mesure et investissez en toute sérénité avec BOB.</p>
              <Link href="/contact">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }} className="hover:opacity-90 transition-opacity">Prendre rendez-vous →</button>
              </Link>
            </div>
            <ServiceSidebar active="/nos-services/conseil-et-accompagnement" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
