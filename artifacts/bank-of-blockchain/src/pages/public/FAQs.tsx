import { useState } from "react";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();
  const f = t.public.faqs;

  return (
    <PublicLayout>
      <PageTitle title="FaQs" breadcrumbs={[{ label: t.public.common.home, href: "/" }, { label: "FaQs" }]} />

      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h3 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>{f.title}</h3>
            <p style={{ color: "#777" }}>{f.subtitle}</p>
          </div>

          <div className="space-y-3">
            {f.items.map(({ q, a }: { q: string; a: string }, i: number) => (
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
            <h3 style={{ color: "#225473", fontSize: "1.4rem", fontWeight: 800, marginBottom: "12px" }}>{f.notFound}</h3>
            <p style={{ color: "#777", marginBottom: "24px" }}>{f.notFoundSubtitle}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <button style={{ background: "#225473", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  {f.contact}
                </button>
              </Link>
              <Link href="/ouverture-de-compte">
                <button style={{ background: "#f6a821", color: "white", border: "none", padding: "13px 28px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
                  className="hover:opacity-90 transition-opacity">
                  {f.createAccount}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
