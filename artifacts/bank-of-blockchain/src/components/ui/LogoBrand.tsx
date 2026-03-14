import { useId } from "react";

interface LogoBrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light";
  className?: string;
}

function BankIcon({ size, id }: { size: number; id: string }) {
  const bgId = `bb-bg-${id}`;
  const glowId = `bb-glow-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={bgId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e6fa8" />
          <stop offset="60%" stopColor="#0e3d6e" />
          <stop offset="100%" stopColor="#061022" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#5cc4ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5cc4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow halo */}
      <circle cx="50" cy="50" r="50" fill={`url(#${glowId})`} />

      {/* Main circle background */}
      <circle cx="50" cy="50" r="44" fill={`url(#${bgId})`} />

      {/* Segmented ring border — circuit/chain effect */}
      <circle
        cx="50" cy="50" r="47"
        fill="none"
        stroke="#3ab0ff"
        strokeWidth="2"
        strokeDasharray="5.5 3"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Bright highlight dot at top */}
      <circle cx="50" cy="5" r="3.5" fill="#8de0ff" opacity="0.85" />
      <circle cx="50" cy="5" r="6" fill="#4db8ff" opacity="0.3" />

      {/* --- Bank building --- */}

      {/* Roof / pediment */}
      <polygon points="20,42 50,20 80,42" fill="white" opacity="0.96" />

      {/* Architrave (horizontal bar below pediment) */}
      <rect x="20" y="42" width="60" height="3.5" rx="1" fill="white" opacity="0.88" />

      {/* 5 columns */}
      <rect x="22" y="45.5" width="7" height="21" rx="3.5" fill="white" opacity="0.92" />
      <rect x="33" y="45.5" width="7" height="21" rx="3.5" fill="white" opacity="0.92" />
      <rect x="44" y="45.5" width="7" height="21" rx="3.5" fill="white" opacity="0.92" />
      <rect x="55" y="45.5" width="7" height="21" rx="3.5" fill="white" opacity="0.92" />
      <rect x="66" y="45.5" width="7" height="21" rx="3.5" fill="white" opacity="0.92" />

      {/* Stylobate step 1 (top) */}
      <rect x="18" y="66.5" width="64" height="5" rx="2" fill="white" opacity="0.96" />

      {/* Stylobate step 2 */}
      <rect x="20" y="71.5" width="60" height="3.5" rx="1.5" fill="#7dd6fa" opacity="0.75" />

      {/* Stylobate step 3 (bottom) */}
      <rect x="22" y="75" width="56" height="3" rx="1.5" fill="#48b8f0" opacity="0.55" />
    </svg>
  );
}

export function LogoBrand({ size = "md", theme = "dark", className = "" }: LogoBrandProps) {
  const uid = useId().replace(/:/g, "");

  const cfg = {
    sm:  { icon: 30, name: "13px", tag: "10px", gap: "8px",  ls: "0.08em", ls2: "0.2em" },
    md:  { icon: 38, name: "15px", tag: "10px", gap: "10px", ls: "0.08em", ls2: "0.2em" },
    lg:  { icon: 48, name: "18px", tag: "11px", gap: "12px", ls: "0.07em", ls2: "0.18em" },
    xl:  { icon: 60, name: "22px", tag: "13px", gap: "14px", ls: "0.07em", ls2: "0.18em" },
  }[size];

  const nameColor = theme === "light" ? "#0f2040" : "#ffffff";
  const tagColor  = "#f6a821";

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: cfg.gap, userSelect: "none" }}
    >
      <BankIcon size={cfg.icon} id={uid} />

      <div style={{ lineHeight: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
        {/* "BLOCKCHAIN" — principal, dark/white */}
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: cfg.name,
          letterSpacing: cfg.ls,
          color: nameColor,
          textTransform: "uppercase",
          lineHeight: 1,
        }}>
          Blockchain
        </span>

        {/* "BANK" — accent gold, spaced */}
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: cfg.tag,
          letterSpacing: cfg.ls2,
          color: tagColor,
          textTransform: "uppercase",
          lineHeight: 1,
        }}>
          Bank
        </span>
      </div>
    </div>
  );
}

export default LogoBrand;
