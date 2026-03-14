import { useState } from "react";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", motif: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <PageTitle title="Contact" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Nous Contacter</span>
            <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 12px" }}>Avez-vous une question?</h2>
            <p style={{ color: "#777", maxWidth: "500px", margin: "0 auto", lineHeight: 1.75 }}>
              Remplissez ce formulaire et un de nos agents vous répond dans les plus brefs délais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "36px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                  <h3 style={{ color: "#225473", fontWeight: 700, fontSize: "1.3rem", marginBottom: "12px" }}>Message envoyé!</h3>
                  <p style={{ color: "#777" }}>Merci pour votre message. Un agent vous contactera dans les plus brefs délais.</p>
                  <button onClick={() => setSent(false)} style={{ marginTop: "20px", background: "#225473", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input type="text" placeholder="Nom & Prénoms *" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", background: "white" }} />
                  </div>
                  <div>
                    <input type="email" placeholder="Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", background: "white" }} />
                  </div>
                  <div>
                    <input type="text" placeholder="Sujet *" required value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", background: "white" }} />
                  </div>
                  <div>
                    <textarea placeholder="Votre message *" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", background: "white", resize: "vertical" }} />
                  </div>
                  <button type="submit"
                    style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}
                    className="hover:opacity-90 transition-opacity">
                    Envoyer le message →
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 style={{ color: "#225473", fontWeight: 800, fontSize: "1.3rem", marginBottom: "24px" }}>Informations de contact</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: <MapPin size={22} />,
                      title: "Localisation",
                      content: "ECB Tower, Sonnemannstraße 20, 60314 Frankfurt am Main, Allemagne",
                    },
                    {
                      icon: <Mail size={22} />,
                      title: "Email",
                      content: "infos@bofblockchain.com",
                      href: "mailto:infos@bofblockchain.com",
                    },
                    {
                      icon: <Phone size={22} />,
                      title: "Horaires d'assistance",
                      content: "Lundi - Vendredi: 9h00 - 18h00",
                    },
                  ].map(({ icon, title, content, href }, i) => (
                    <div key={i} className="flex gap-4">
                      <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div>
                        <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "4px" }}>{title}</h4>
                        {href ? (
                          <a href={href} style={{ color: "#777", fontSize: "0.95rem" }} className="hover:text-[#225473] transition-colors">{content}</a>
                        ) : (
                          <p style={{ color: "#777", fontSize: "0.95rem", lineHeight: 1.6 }}>{content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#225473", borderRadius: "12px", padding: "28px" }}>
                <h4 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px" }}>Support prioritaire</h4>
                <p style={{ color: "#b8d4e8", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "20px" }}>
                  Pour les demandes urgentes de remboursement, notre équipe prioritaire est disponible 24h/24 et 7j/7.
                </p>
                <a href="mailto:infos@bofblockchain.com">
                  <button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 22px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
                    className="hover:opacity-90 transition-opacity">
                    Contacter le support →
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
