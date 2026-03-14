import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

function hashPath(path: string): number {
  let h = 5381;
  for (let i = 0; i < path.length; i++) {
    h = ((h << 5) + h) ^ path.charCodeAt(i);
  }
  return Math.abs(h);
}

function mkRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const ANIM_NAMES = ["btc-rise", "btc-rise-sway", "btc-fall-spin", "btc-drift-lr", "btc-spiral", "btc-burst"];
const SIZES = [14, 18, 22, 28, 36, 44];
const SPEEDS = [8, 11, 14, 17, 22, 26];

function BitcoinSVG({ size, opacity, glow }: { size: number; opacity: number; glow: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.35)}px rgba(246,168,33,0.7))` : undefined }}>
      <circle cx="50" cy="50" r="48" fill="rgba(246,168,33,0.15)" stroke="#f6a821" strokeWidth="3" opacity={opacity} />
      <text x="50" y="67" textAnchor="middle" fontSize="58" fontFamily="Arial" fontWeight="bold"
        fill="#f6a821" opacity={opacity} style={{ fontFamily: "Arial" }}>₿</text>
    </svg>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  anim: string;
  glow: boolean;
  spinDir: number;
}

export default function BitcoinParticles({ count = 18 }: { count?: number }) {
  const [location] = useLocation();
  const rng = mkRng(hashPath(location || "/"));
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const r = rng;
    particles.push({
      id: i,
      x: Math.round(r() * 100),
      y: Math.round(r() * 110 - 10),
      size: SIZES[Math.floor(r() * SIZES.length)],
      opacity: +(0.06 + r() * 0.14).toFixed(2),
      duration: SPEEDS[Math.floor(r() * SPEEDS.length)],
      delay: -(r() * 20),
      anim: ANIM_NAMES[Math.floor(r() * ANIM_NAMES.length)],
      glow: r() > 0.55,
      spinDir: r() > 0.5 ? 1 : -1,
    });
  }

  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden",
    }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${p.y}%`,
          animation: `${p.anim} ${p.duration}s ${p.delay}s linear infinite`,
          willChange: "transform, opacity",
        }}>
          <div style={{
            animation: `btc-spin-self ${p.duration * 1.3}s ${p.delay}s linear infinite`,
            animationDirection: p.spinDir > 0 ? "normal" : "reverse",
          }}>
            <BitcoinSVG size={p.size} opacity={p.opacity} glow={p.glow} />
          </div>
        </div>
      ))}
    </div>
  );
}
