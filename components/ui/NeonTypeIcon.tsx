"use client";

import Image from "next/image";
import type { ValuesType } from "@/types/database";

const CONFIG: Record<ValuesType, { color: string; glow: string }> = {
  challenger: { color: "#FF7A00", glow: "rgba(255,122,0,0.5)"   },
  stable:     { color: "#4ADE4A", glow: "rgba(74,222,74,0.5)"   },
  team:       { color: "#00AAFF", glow: "rgba(0,170,255,0.5)"   },
  specialist: { color: "#9966FF", glow: "rgba(153,102,255,0.45)" },
};

// PNG があるタイプ（白背景 PNG を screen blend で黒背景に合成）
const PNG_TYPES: Partial<Record<ValuesType, string>> = {
  challenger: "/icons/challenger.png",
  team:       "/icons/team.png",
  specialist: "/icons/explorer.png",
};

/* ── 安定型: 植物 + 全円フレーム + 根（PNG未取得のため SVG） */
function StableSVG({ c }: { c: string }) {
  const lp = { stroke: c, strokeWidth: "2.8", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* 外周の円 */}
      <circle cx="50" cy="50" r="42" {...lp} strokeWidth="2.6"/>
      {/* 地面ライン */}
      <line x1="8" y1="56" x2="92" y2="56" {...lp}/>
      {/* 茎 */}
      <line x1="50" y1="56" x2="50" y2="30" {...lp}/>
      {/* 上の葉 */}
      <path d="M50 30 C47 20 53 20 50 30Z" {...lp} strokeWidth="2.4"/>
      {/* 左の葉 */}
      <path d="M50 46 C40 40 32 28 44 22 C52 28 52 42 50 46Z" {...lp} strokeWidth="2.4"/>
      {/* 右の葉 */}
      <path d="M50 42 C60 36 68 24 56 18 C48 24 48 38 50 42Z" {...lp} strokeWidth="2.4"/>
      {/* 根（中央） */}
      <path d="M50 56 L50 74" {...lp} strokeWidth="2.2"/>
      {/* 根（左） */}
      <path d="M50 60 Q42 68 36 76" {...lp} strokeWidth="2.2"/>
      {/* 根（右） */}
      <path d="M50 60 Q58 68 64 76" {...lp} strokeWidth="2.2"/>
      {/* 根（左外） */}
      <path d="M38 70 Q30 74 24 78" {...lp} strokeWidth="1.8"/>
      {/* 根（右外） */}
      <path d="M62 70 Q70 74 76 78" {...lp} strokeWidth="1.8"/>
    </svg>
  );
}

/* ── 公開コンポーネント ───────────────────────────── */
const SIZES = { sm: 64, md: 120, lg: 200 };

type Props = {
  type: ValuesType;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function NeonTypeIcon({ type, size = "md", className = "" }: Props) {
  const { color, glow } = CONFIG[type];
  const px = SIZES[size];
  const pngSrc = PNG_TYPES[type];
  const glowFilter = `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 18px ${color})`;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-black ${className}`}
      style={{ width: px, height: px, flexShrink: 0 }}
    >
      {/* glow blob */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle at center, ${glow} 0%, transparent 68%)` }}
      />
      {/* icon */}
      <div
        style={{
          width: px * 0.72,
          height: px * 0.72,
          filter: glowFilter,
          position: "relative",
          mixBlendMode: pngSrc ? "screen" : undefined,
        }}
      >
        {pngSrc ? (
          <Image
            src={pngSrc}
            alt={type}
            fill
            style={{ objectFit: "contain" }}
          />
        ) : (
          <StableSVG c={color} />
        )}
      </div>
    </div>
  );
}
