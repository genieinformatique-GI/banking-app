import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle, Shield, Eye, Lock, Globe, Users, Banknote, FileText } from "lucide-react";

export default function Engagement() {
  return (
    <PublicLayout>
      <PageTitle
        title="Notre Engagement"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Engagement Sécurité et transparence" }]}
      />

      {/* Intro */}
      <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p style={{ color: "#555", lineHeight: 1.85, fontSize: "1.05rem" }}>
            Chez BOB, nous plaçons votre sécurité et votre confiance au cœur de nos priorités. Nous avons mis en place des standards rigoureux pour garantir la protection de vos actifs et assurer une totale transparence dans toutes nos opérations.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#225473", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Statistiques</span>
            <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Notre impact social</h2>
            <p style={{ color: "#b8d4e8" }}>Retrouvez les chiffres clés de nos activités. La BOB toujours et encore plus près de sa clientèle!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Globe size={28} />, value: "65+", label: "Pays" },
              { icon: <Users size={28} />, value: "10 000+", label: "Clients" },
              { icon: <Banknote size={28} />, value: "50M€+", label: "€ Remboursés" },
              { icon: <FileText size={28} />, value: "1000+", label: "Financements en cours" },
            ].map(({ icon, value, label }, i) => (
              <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.07)", borderRadius: "12px", padding: "32px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#f6a821", display: "flex", justifyContent: "center", marginBottom: "12px" }}>{icon}</div>
                <div style={{ color: "#f6a821", fontSize: "2rem", fontWeight: 800 }}>{value}</div>
                <div style={{ color: "#b8d4e8", marginTop: "6px", fontSize: "0.9rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Values */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Nos valeurs</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0" }}>Sécurité & Transparence</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield size={28} />,
                title: "Sécurité maximale",
                desc: "Vos actifs sont protégés par des protocoles de sécurité de niveau militaire et des smart contracts audités.",
              },
              {
                icon: <Eye size={28} />,
                title: "Transparence totale",
                desc: "Toutes nos opérations sont enregistrées sur la blockchain et consultables en temps réel par nos clients.",
              },
              {
                icon: <Lock size={28} />,
                title: "Protection des données",
                desc: "Conformes au RGPD, vos données personnelles sont chiffrées et ne sont jamais partagées avec des tiers.",
              },
              {
                icon: <Globe size={28} />,
                title: "Conformité réglementaire",
                desc: "Nous collaborons avec l'AMF, la SEC et Interpol pour garantir une conformité totale aux réglementations internationales.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#f8f9fa", borderRadius: "12px", padding: "32px 24px", textAlign: "center", borderTop: "4px solid #225473" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  {icon}
                </div>
                <h3 style={{ color: "#225473", fontWeight: 700, fontSize: "1rem", marginBottom: "10px" }}>{title}</h3>
                <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments List */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Nos engagements</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 24px", lineHeight: 1.3 }}>Ce que nous promettons à nos clients</h2>
              <ul className="space-y-4">
                {[
                  "Traitement de votre dossier en moins de 48 heures",
                  "Rapport détaillé de chaque opération effectuée",
                  "Aucun frais caché ni commission surprise",
                  "Remboursement intégral en cas d'échec de notre part",
                  "Confidentialité absolue de vos informations",
                  "Accès permanent à votre espace client sécurisé",
                  "Support téléphonique et email dédié 7j/7",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: "#555", lineHeight: 1.6 }}>
                    <CheckCircle size={18} style={{ color: "#f6a821", marginTop: "2px", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "linear-gradient(135deg, #225473 0%, #1a3d54 100%)", borderRadius: "16px", padding: "40px", textAlign: "center", color: "white" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "16px" }}>Partenaires officiels</h3>
              <p style={{ color: "#b8d4e8", lineHeight: 1.75, marginBottom: "24px" }}>
                Nous travaillons en étroite collaboration avec les principales autorités de régulation financière mondiales.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["🏛️ AMF (France)", "🏛️ SEC (USA)", "🌐 Interpol", "🇪🇺 BCE (Europe)"].map((org, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "16px", fontSize: "0.9rem", fontWeight: 600 }}>
                    {org}
                  </div>
                ))}
              </div>
              <Link href="/partenariats-amf-sec">
                <button style={{ marginTop: "24px", background: "#f6a821", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", width: "100%" }}
                  className="hover:opacity-90 transition-opacity">
                  En savoir plus sur nos partenariats →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
