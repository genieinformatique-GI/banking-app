import ServiceSidebar from "@/components/ServiceSidebar";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function Remboursement() {
  return (
    <PublicLayout>
      <PageTitle
        title="Remboursement des Pertes en Cryptomonnaie"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "#" }, { label: "Remboursement des Pertes" }]}
      />
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 style={{ color: "#225473", fontSize: "1.6rem", fontWeight: 800, marginBottom: "12px", lineHeight: 1.3 }}>
                Vous avez perdu de l'argent sur une plateforme crypto frauduleuse ou défaillante?
              </h2>
              <h5 style={{ color: "#f6a821", fontWeight: 700, marginBottom: "24px" }}>Blockchain Bank est là pour vous aider à récupérer vos fonds.</h5>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Comment ça marche?</h5>
              <div className="space-y-6 mb-10">
                {[
                  { step: "1. Soumettez votre demande", desc: "Remplissez notre formulaire en ligne avec les détails de votre perte et les preuves des transactions effectuées sur la plateforme frauduleuse. Nous vous guiderons à travers chaque étape pour vous assurer que toutes les informations nécessaires sont fournies." },
                  { step: "2. Vérification et validation", desc: "Notre équipe d'experts analyse votre dossier, vérifie les preuves fournies et évalue les possibilités de récupération. Nous collaborons avec les autorités financières (AMF, SEC) pour identifier les fautifs." },
                  { step: "3. Procédures légales et blockchain", desc: "Nous engageons les procédures légales nécessaires et utilisons nos outils blockchain pour tracer et récupérer vos fonds. Nos avocats partenaires interviennent dans plus de 65 pays." },
                  { step: "4. Remboursement", desc: "Une fois les fonds récupérés, vous recevez votre remboursement directement sur votre compte bancaire ou portefeuille crypto, selon votre préférence. Le transfert est sécurisé via smart contract." },
                ].map(({ step, desc }, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle size={20} style={{ color: "#f6a821", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <strong style={{ color: "#225473" }}>{step}</strong>
                      <p style={{ color: "#666", marginTop: "6px", lineHeight: 1.7, fontSize: "0.95rem" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h5 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>Qui peut faire une demande?</h5>
              <ul className="space-y-3 mb-10">
                {[
                  "Victimes de plateformes de trading crypto non réglementées",
                  "Investisseurs ayant perdu des fonds sur des exchanges disparus",
                  "Personnes escroquées par de faux projets crypto (ICO, NFT, DeFi)",
                  "Victimes de phishing et de vol de portefeuilles numériques",
                  "Entreprises ayant subi des pertes crypto suite à des fraudes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <CheckCircle size={16} style={{ color: "#225473", flexShrink: 0, marginTop: "2px" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/ouverture-de-compte">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 30px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Déposer ma demande →
                </button>
              </Link>
            </div>
            {/* Sidebar */}
            <ServiceSidebar activeKey="remboursement" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
