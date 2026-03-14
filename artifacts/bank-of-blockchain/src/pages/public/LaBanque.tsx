import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function LaBanque() {
  return (
    <PublicLayout>
      <PageTitle title="La Banque" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "La Banque" }]} />

      {/* About Section */}
      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://bofblockchain.com/template/img/ICONE BLEU.png" alt="BOB" style={{ width: "60%", marginBottom: "16px", borderRadius: "8px" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <img src="https://bofblockchain.com/template/img/about-image/About 1.jpg" alt="About" style={{ width: "80%", borderRadius: "8px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>A Propos</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>Découvrez-nous</h2>
              <p style={{ color: "#444", fontWeight: 600, lineHeight: 1.75, marginBottom: "16px" }}>
                La banque blockchain est l'organisme de régulation des transactions de cryptomonnaie sur le marché financier. Nous travaillons en collaboration avec l'AMF et la SEC pour assurer la transparence et la sécurité des investissements en actifs numériques.
              </p>
              <p style={{ color: "#666", lineHeight: 1.75, marginBottom: "24px" }}>
                Nous sommes là pour rembourser toutes les personnes qui ont investi de l'argent sans toutefois perdre sur les plateformes de cryptomonnaie qui exerçaient sans licence financière sur le marché boursier. Notre mission est de protéger les investisseurs, de leur offrir une seconde chance et de garantir une finance plus équitable grâce aux technologies blockchain et aux smart contracts.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Partenaire officiel de l'AMF et de la SEC",
                  "Technologie blockchain et smart contracts",
                  "Remboursement sécurisé et transparent",
                  "65+ pays couverts dans le monde",
                  "10 000+ clients accompagnés avec succès",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3" style={{ color: "#555", fontSize: "0.95rem" }}>
                    <CheckCircle size={18} style={{ color: "#225473", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/ouverture-de-compte">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  Ouvrir mon compte →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: "#225473", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Statistiques</span>
            <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Notre impact social</h2>
            <p style={{ color: "#b8d4e8" }}>Retrouvez les chiffres clés de nos activités. La BOB toujours et encore plus près de sa clientèle!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🌍", value: "65+", label: "Pays" },
              { icon: "👥", value: "10 000+", label: "Clients" },
              { icon: "💶", value: "50M€+", label: "Remboursés" },
              { icon: "📋", value: "1000+", label: "Financements en cours" },
            ].map(({ icon, value, label }, i) => (
              <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.07)", borderRadius: "12px", padding: "32px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{icon}</div>
                <div style={{ color: "#f6a821", fontSize: "2rem", fontWeight: 800 }}>{value}</div>
                <div style={{ color: "#b8d4e8", marginTop: "6px", fontSize: "0.9rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
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
              <img key={i} src={src} alt="Partenaire" style={{ height: "50px", width: "auto", objectFit: "contain", filter: "grayscale(60%)", opacity: 0.75 }}
                className="hover:grayscale-0 hover:opacity-100 transition-all"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section style={{ background: "#f8f9fa", padding: "80px 0", textAlign: "center" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>Rejoignez la Bank of Blockchain</h2>
          <p style={{ color: "#777", lineHeight: 1.75, marginBottom: "32px" }}>
            Faites partie des milliers de clients qui nous font confiance pour la protection et la récupération de leurs investissements en cryptomonnaies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/ouverture-de-compte">
              <button style={{ background: "#225473", color: "white", border: "none", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                className="hover:opacity-90 transition-opacity">
                Créer mon compte →
              </button>
            </Link>
            <Link href="/contact">
              <button style={{ background: "transparent", color: "#225473", border: "2px solid #225473", padding: "14px 32px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
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
