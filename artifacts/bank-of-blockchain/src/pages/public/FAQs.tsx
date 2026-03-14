import { useState } from "react";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Qui peut bénéficier du remboursement?",
    a: "Toute personne ayant subi une perte sur une plateforme de trading non régulée peut faire une demande. Que vous ayez été victime d'une arnaque, d'une plateforme qui a cessé ses activités, ou d'un investissement frauduleux, notre équipe examinera votre dossier.",
  },
  {
    q: "Comment fonctionne le processus de remboursement?",
    a: "Le processus se déroule en 4 étapes : 1) Création de votre compte et soumission de votre dossier, 2) Analyse et vérification par nos experts, 3) Engagement des procédures légales et blockchain, 4) Versement du remboursement sur votre compte. Tout le processus est transparent et traçable.",
  },
  {
    q: "Combien de temps dure le processus?",
    a: "Le délai varie en fonction de la complexité de votre dossier et du montant des pertes. En moyenne, les remboursements simples sont traités en 5 à 15 jours ouvrables. Des dossiers plus complexes nécessitant des procédures légales internationales peuvent prendre plus de temps.",
  },
  {
    q: "Quels documents dois-je fournir?",
    a: "Vous devrez fournir : une copie de vos relevés de transactions sur la plateforme frauduleuse, vos justificatifs de paiement (virements bancaires, relevés de carte), une pièce d'identité valide, et tout autre document prouvant votre investissement et votre perte.",
  },
  {
    q: "Quels sont vos frais de service?",
    a: "Nous fonctionnons sur un modèle de commission sur succès. Nous ne prélevons des frais que si nous parvenons à récupérer vos fonds. Le taux de commission est défini lors de la signature de votre contrat de service et varie selon le montant et la complexité du dossier.",
  },
  {
    q: "Proposez-vous des conseils pour les entreprises?",
    a: "Oui, nous accompagnons aussi les entreprises et institutions souhaitant intégrer la blockchain dans leur activité. Nous offrons des services de conseil en conformité réglementaire, en sécurité des actifs numériques et en stratégie d'investissement blockchain.",
  },
  {
    q: "Comment puis-je accéder au service de conseil?",
    a: "Il suffit de créer un compte sur BOB et de prendre rendez-vous avec l'un de nos experts. Vous pouvez aussi nous contacter directement par email ou via le formulaire de contact disponible sur notre site.",
  },
  {
    q: "Votre service est-il disponible dans mon pays?",
    a: "Nos services sont disponibles dans plus de 65 pays à travers le monde. Grâce à nos partenariats avec l'AMF, la SEC et Interpol, nous pouvons intervenir dans la grande majorité des pays. Contactez-nous pour vérifier la disponibilité dans votre région.",
  },
  {
    q: "Comment la blockchain garantit-elle la sécurité des transactions?",
    a: "La blockchain est un registre distribué et immuable qui enregistre toutes les transactions de manière permanente et vérifiable. Nos smart contracts automatisent les remboursements et garantissent que les fonds sont transférés exactement comme prévu, sans possibilité d'altération.",
  },
  {
    q: "Comment gérer mes taxes liées aux cryptomonnaies?",
    a: "Notre plateforme génère automatiquement un relevé détaillé de toutes vos transactions, accessible depuis votre espace client. Vous pouvez exporter ce document pour faciliter votre déclaration fiscale. Nous proposons également un service spécialisé de gestion des taxes crypto.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PublicLayout>
      <PageTitle title="FaQs" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "FaQs" }]} />

      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h3 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>Foire Aux Questions (FAQ)</h3>
            <p style={{ color: "#777" }}>Retrouvez ici les réponses aux questions les plus fréquentes concernant nos services.</p>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} style={{ border: "1px solid #eee", borderRadius: "10px", overflow: "hidden" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                  style={{ padding: "20px 24px", background: open === i ? "#225473" : "white", color: open === i ? "white" : "#333", fontWeight: 600, fontSize: "0.95rem", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <strong>{q}</strong>
                  <ChevronDown size={18} style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </button>
                {open === i && (
                  <div style={{ padding: "20px 24px", background: "#f8f9fa", color: "#555", lineHeight: 1.75, fontSize: "0.95rem" }}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "50px", background: "#f8f9fa", borderRadius: "12px", padding: "40px" }}>
            <h3 style={{ color: "#225473", fontSize: "1.4rem", fontWeight: 800, marginBottom: "12px" }}>Vous n'avez pas trouvé votre réponse?</h3>
            <p style={{ color: "#777", marginBottom: "24px" }}>Notre équipe est disponible pour répondre à toutes vos questions spécifiques.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Nous contacter →
                </button>
              </Link>
              <Link href="/ouverture-de-compte">
                <button style={{ background: "#f6a821", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Créer mon compte
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
