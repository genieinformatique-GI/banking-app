import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_LINKS = [
  { key: "remboursement", href: "/nos-services/remboursement-des-pertes" },
  { key: "securisation", href: "/nos-services/securisation-des-investissements" },
  { key: "conseil", href: "/nos-services/conseil-et-accompagnement" },
  { key: "staking", href: "/nos-services/services-de-staking" },
  { key: "licence", href: "/nos-services/licence-de-trading" },
  { key: "taxe", href: "/nos-services/taxe-crypto" },
] as const;

interface ServiceSidebarProps {
  activeKey: typeof SERVICE_LINKS[number]["key"];
}

export default function ServiceSidebar({ activeKey }: ServiceSidebarProps) {
  const { t } = useLanguage();
  const s = t.public.services;

  return (
    <div>
      <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "28px", marginBottom: "20px" }}>
        <h4 style={{ color: "#225473", fontWeight: 700, marginBottom: "16px" }}>{s.sidebarTitle}</h4>
        <ul className="space-y-2">
          {SERVICE_LINKS.map(({ key, href }) => {
            const active = key === activeKey;
            return (
              <li key={key}>
                <Link href={href}
                  style={{ display: "block", padding: "10px 14px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: active ? 700 : 500, background: active ? "#225473" : "transparent", color: active ? "white" : "#555" }}
                  className={active ? "" : "hover:bg-gray-200 transition-colors"}>
                  {s.names[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ background: "#225473", borderRadius: "12px", padding: "28px", color: "white", textAlign: "center" }}>
        <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>{s.help}</h4>
        <p style={{ color: "#b8d4e8", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.6 }}>{s.helpDesc}</p>
        <Link href="/contact">
          <button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 20px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", width: "100%", fontSize: "0.9rem" }}
            className="hover:opacity-90 transition-opacity">
            {s.contactBtn}
          </button>
        </Link>
      </div>
    </div>
  );
}
