import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function AssuranceCrypto() {
  return (
    <PublicLayout>
      <PageTitle
        title="Assurance crypto"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Assurance crypto" }]}
      />

      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Assurance Crypto</h2>
          <h3 style={{ color: "#444", fontSize: "1.3rem", fontWeight: 600, marginBottom: "20px" }}>Protégez Vos Investissements Numériques</h3>
          <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "16px" }}>
            L'investissement en cryptomonnaies offre des opportunités exceptionnelles, mais il n'est pas sans risques. Chez BOB, nous comprenons l'importance de sécuriser vos actifs numériques et d'offrir une protection contre les fraudes et escroqueries.
          </p>
          <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "32px" }}>
            C'est pourquoi nous avons créé l'Assurance Crypto, un service exclusif destiné à rembourser les victimes d'arnaques sur les plateformes d'investissement frauduleuses.
          </p>

          <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: "32px" }} />

          <h3 style={{ color: "#225473", fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px" }}>Pourquoi souscrire à l'Assurance Crypto?</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: "🛡️",
                title: "Protection contre les arnaques",
                desc: "En cas d'escroquerie sur une plateforme frauduleuse, notre assurance couvre vos pertes et déclenche le processus de remboursement.",
              },
              {
                icon: "⚡",
                title: "Remboursement rapide",
                desc: "Grâce à nos partenariats avec l'AMF et la SEC, le processus de remboursement est rapide et transparent.",
              },
              {
                icon: "🔍",
                title: "Investigation complète",
                desc: "Nos experts analysent chaque dossier en profondeur pour maximiser vos chances de récupérer vos fonds.",
              },
              {
                icon: "🌐",
                title: "Couverture mondiale",
                desc: "Notre assurance est valable dans plus de 65 pays, couvrant les principales plateformes frauduleuses mondiales.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#f8f9fa", borderRadius: "12px", padding: "24px", borderLeft: "4px solid #225473" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{icon}</div>
                <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "8px" }}>{title}</h4>
                <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: "#225473", fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px" }}>Comment fonctionne l'Assurance Crypto?</h3>
          <div className="space-y-4 mb-12">
            {[
              { step: "1", title: "Souscription", desc: "Créez votre compte BOB et activez votre couverture Assurance Crypto en quelques minutes." },
              { step: "2", title: "Déclaration du sinistre", desc: "En cas de perte, déclarez votre sinistre en ligne avec les preuves de transactions." },
              { step: "3", title: "Investigation", desc: "Nos experts analysent votre dossier et contactent les autorités compétentes." },
              { step: "4", title: "Remboursement", desc: "Recevez votre remboursement directement sur votre compte via blockchain." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start" style={{ background: "#f8f9fa", borderRadius: "10px", padding: "20px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                  {step}
                </div>
                <div>
                  <div style={{ color: "#225473", fontWeight: 700, marginBottom: "4px" }}>{title}</div>
                  <div style={{ color: "#666", fontSize: "0.9rem" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: "#225473", fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px" }}>Ce qui est couvert</h3>
          <ul className="space-y-3 mb-12">
            {[
              "Pertes dues à des plateformes de trading frauduleuses",
              "Escroqueries par phishing et vol d'identité",
              "Pertes sur des exchanges non régulés ayant cessé leurs activités",
              "Fraudes aux investissements en cryptomonnaies",
              "Arnaques aux faux projets ICO/NFT",
              "Piratage de portefeuilles numériques",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3" style={{ color: "#555" }}>
                <CheckCircle size={18} style={{ color: "#f6a821", flexShrink: 0, marginTop: "2px" }} />
                {item}
              </li>
            ))}
          </ul>

          <div style={{ background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
            <h3 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>Souscrire à l'Assurance Crypto</h3>
            <p style={{ color: "#b8d4e8", marginBottom: "24px", lineHeight: 1.65 }}>
              Protégez dès maintenant vos investissements en cryptomonnaies et bénéficiez d'une couverture complète contre les fraudes.
            </p>
            <Link href="/ouverture-de-compte">
              <button style={{ background: "#f6a821", color: "white", border: "none", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                className="hover:opacity-90 transition-opacity">
                Créer mon compte maintenant →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
