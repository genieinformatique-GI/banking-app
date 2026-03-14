import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle, Globe, Users, Banknote, FileText, Scale, ScanSearch, Shield, Handshake } from "lucide-react";

export default function Partenariats() {
  return (
    <PublicLayout>
      <PageTitle
        title="Partenariats AMF et SEC"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Partenariats AMF et SEC" }]}
      />

      {/* About Section — same layout as LaBanque */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://bofblockchain.com/template/img/ICONE BLEU.png"
                alt="BOB"
                style={{ width: "60%", marginBottom: "16px", borderRadius: "8px" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <img
                src="https://bofblockchain.com/template/img/about-image/About 1.jpg"
                alt="Régulation"
                style={{ width: "80%", borderRadius: "8px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Régulation & Conformité</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>
                Nos Partenariats avec l'AMF et la SEC
              </h2>
              <p style={{ color: "#444", fontWeight: 600, lineHeight: 1.75, marginBottom: "16px" }}>
                La Bank of Blockchain opère en totale conformité avec les réglementations financières internationales grâce à ses partenariats officiels avec l'AMF (Autorité des Marchés Financiers) et la SEC (Securities and Exchange Commission).
              </p>
              <p style={{ color: "#666", lineHeight: 1.75, marginBottom: "24px" }}>
                Ces collaborations officielles nous donnent accès à des ressources uniques pour récupérer vos fonds, poursuivre les plateformes frauduleuses et garantir une protection maximale à chaque investisseur que nous accompagnons.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Agrément officiel AMF pour les opérations européennes",
                  "Enregistrement auprès de la SEC pour les marchés américains",
                  "Accès aux bases de données internationales de fraude",
                  "Procédures légales dans plus de 65 pays",
                  "Conformité RGPD et protection des données garanties",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <CheckCircle size={18} style={{ color: "#225473", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/ouverture-de-compte">
                <button
                  style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Déposer ma demande →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AMF & SEC Cards */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Nos Autorités Partenaires</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Régulateurs de confiance</h2>
            <p style={{ color: "#777", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
              Deux des plus grandes autorités financières mondiales garantissent la légitimité de chacune de nos actions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                code: "FR",
                org: "AMF",
                name: "Autorité des Marchés Financiers",
                country: "France — Union Européenne",
                desc: "L'AMF est le régulateur français des marchés financiers. Notre partenariat avec l'AMF garantit que toutes nos opérations en France et dans l'Union Européenne respectent les strictes réglementations en matière de protection des investisseurs et de lutte contre la fraude.",
                points: [
                  "Agrément officiel pour les opérations de remboursement",
                  "Surveillance continue de nos activités",
                  "Coopération dans les enquêtes anti-fraude",
                  "Garantie de conformité RGPD",
                ],
              },
              {
                code: "US",
                org: "SEC",
                name: "Securities and Exchange Commission",
                country: "États-Unis — Amérique du Nord",
                desc: "La SEC est le principal régulateur des marchés financiers américains. Notre collaboration avec la SEC nous permet d'opérer légalement sur les marchés nord-américains et d'offrir une protection maximale à nos clients investisseurs.",
                points: [
                  "Enregistrement officiel auprès de la SEC",
                  "Conformité aux réglementations américaines",
                  "Accès aux bases de données de fraude",
                  "Support juridique international",
                ],
              },
            ].map(({ code, org, name, country, desc, points }, i) => (
              <div key={i} style={{ border: "1px solid #edf2f7", borderRadius: "16px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", borderTop: "4px solid #225473" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #225473, #1a3d56)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f6a821", fontWeight: 800, fontSize: "1rem", flexShrink: 0
                  }}>
                    {code}
                  </div>
                  <div>
                    <div style={{ color: "#225473", fontWeight: 800, fontSize: "1.5rem" }}>{org}</div>
                    <div style={{ color: "#888", fontSize: "0.88rem" }}>{name}</div>
                    <div style={{ color: "#f6a821", fontSize: "0.8rem", fontWeight: 600 }}>{country}</div>
                  </div>
                </div>
                <p style={{ color: "#555", lineHeight: 1.75, marginBottom: "20px", fontSize: "0.95rem" }}>{desc}</p>
                <ul className="space-y-3">
                  {points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3" style={{ color: "#555", fontSize: "0.92rem" }}>
                      <CheckCircle size={16} style={{ color: "#f6a821", marginTop: "3px", flexShrink: 0 }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section — same as LaBanque */}
      <section style={{ background: "#225473", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Statistiques</span>
            <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Notre impact social</h2>
            <p style={{ color: "#b8d4e8" }}>Des chiffres qui témoignent de la confiance que nos clients nous accordent chaque jour.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Globe size={28} />, value: "65+", label: "Pays" },
              { icon: <Users size={28} />, value: "10 000+", label: "Clients" },
              { icon: <Banknote size={28} />, value: "50M€+", label: "Remboursés" },
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

      {/* Why It Matters */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Pourquoi c'est important</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Ce que ces partenariats vous apportent</h2>
            <p style={{ color: "#777", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
              Ces collaborations officielles nous donnent accès à des ressources uniques pour récupérer vos fonds.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Scale size={32} />, title: "Recours légaux", desc: "Nos partenariats nous permettent d'engager des procédures légales dans plus de 65 pays pour récupérer vos investissements." },
              { icon: <ScanSearch size={32} />, title: "Traçabilité", desc: "Nous avons accès aux outils de traçabilité des transactions blockchain les plus avancés pour retrouver vos fonds." },
              { icon: <Shield size={32} />, title: "Protection maximale", desc: "Des canaux officiels garantissent que vos remboursements arrivent rapidement et en toute sécurité." },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "36px 28px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", borderTop: "3px solid #f6a821" }}>
                <div style={{ color: "#225473", display: "flex", justifyContent: "center", marginBottom: "18px" }}>{icon}</div>
                <h4 style={{ color: "#225473", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px" }}>{title}</h4>
                <p style={{ color: "#777", lineHeight: 1.7, fontSize: "0.95rem" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banques partenaires — exactly like LaBanque */}
      <section style={{ background: "white", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: "#225473", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "40px" }}>Banques partenaires</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              "https://bofblockchain.com/partners/ubs.png",
              "https://bofblockchain.com/partners/credit-suisse.png",
              "https://bofblockchain.com/partners/post-finance.png",
              "https://bofblockchain.com/partners/PIctet.png",
              "https://bofblockchain.com/partners/zkb.png",
              "https://bofblockchain.com/partners/unicredit.jpg",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Partenaire"
                style={{ height: "50px", width: "auto", objectFit: "contain", filter: "grayscale(60%)", opacity: 0.75 }}
                className="hover:grayscale-0 hover:opacity-100 transition-all"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA — same as LaBanque */}
      <section style={{ background: "#f8f9fa", padding: "80px 0", textAlign: "center" }}>
        <div className="max-w-3xl mx-auto px-6">
          <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Passez à l'action</span>
          <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "16px 0 16px" }}>Rejoignez la Bank of Blockchain</h2>
          <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "32px" }}>
            Faites partie des milliers de clients qui nous font confiance pour la protection et la récupération de leurs investissements en cryptomonnaies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/ouverture-de-compte">
              <button
                style={{ background: "#225473", color: "white", border: "none", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                className="hover:opacity-90 transition-opacity">
                Créer mon compte →
              </button>
            </Link>
            <Link href="/contact">
              <button
                style={{ background: "transparent", color: "#225473", border: "2px solid #225473", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                className="hover:bg-[#225473] hover:text-white transition-all">
                Nous contacter
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
