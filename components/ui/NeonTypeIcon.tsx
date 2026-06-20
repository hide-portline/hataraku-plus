"use client";

import type { ValuesType } from "@/types/database";

const CONFIG: Record<ValuesType, { color: string; glow: string }> = {
  challenger: { color: "#FF7A00", glow: "rgba(255,122,0,0.5)"   },
  stable:     { color: "#4ADE4A", glow: "rgba(74,222,74,0.5)"   },
  team:       { color: "#00AAFF", glow: "rgba(0,170,255,0.5)"   },
  specialist: { color: "#9966FF", glow: "rgba(153,102,255,0.45)" },
};

/* ── 挑戦型: 疾走するランナー + 速度線 ──────────────── */
function ChallengerSVG({ c }: { c: string }) {
  const lp = { stroke: c, strokeWidth: "2.6", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* 速度線 (背後から左下へ) */}
      <line x1="6"  y1="18" x2="38" y2="30" {...lp} strokeWidth="2.2"/>
      <line x1="4"  y1="38" x2="36" y2="44" {...lp} strokeWidth="2.2"/>
      <line x1="6"  y1="58" x2="36" y2="55" {...lp} strokeWidth="2.2"/>
      <line x1="6"  y1="75" x2="34" y2="68" {...lp} strokeWidth="1.8"/>
      {/* 頭部 */}
      <circle cx="68" cy="20" r="9" stroke={c} strokeWidth="2.6" fill="none"/>
      {/* 上体 (前傾姿勢) */}
      <path d="M68 29 Q64 40 60 52" {...lp}/>
      {/* 後ろ腕 */}
      <path d="M65 38 Q56 32 48 28" {...lp}/>
      {/* 前腕 */}
      <path d="M65 38 Q72 44 78 52" {...lp}/>
      {/* 後ろ脚 */}
      <path d="M60 52 Q52 63 46 74" {...lp}/>
      <path d="M46 74 Q40 79 36 82" {...lp}/>
      {/* 前脚 (蹴り出し) */}
      <path d="M60 52 Q68 62 72 72" {...lp}/>
      <path d="M72 72 Q76 76 82 80" {...lp}/>
    </svg>
  );
}

/* ── 安定型: 植物 + 上部アーク + 根 ─────────────────── */
function StableSVG({ c }: { c: string }) {
  const lp = { stroke: c, strokeWidth: "2.6", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* 上部の半円アーク */}
      <path d="M14 58 A38 38 0 0 1 86 58" {...lp} strokeWidth="2.4"/>
      {/* 地面ライン */}
      <line x1="14" y1="62" x2="86" y2="62" {...lp} strokeWidth="2.6"/>
      {/* 茎 */}
      <line x1="50" y1="62" x2="50" y2="36" {...lp}/>
      {/* 中央の葉 (上) */}
      <path d="M50 36 C46 24 54 24 50 36Z" {...lp} strokeWidth="2.2"/>
      {/* 左の葉 */}
      <path d="M50 48 C42 42 34 30 44 22 C52 26 54 40 50 48Z" {...lp} strokeWidth="2.2"/>
      {/* 右の葉 */}
      <path d="M50 44 C58 38 66 26 56 18 C48 22 46 36 50 44Z" {...lp} strokeWidth="2.2"/>
      {/* 根 */}
      <path d="M50 62 Q44 70 38 80" {...lp} strokeWidth="2.2"/>
      <path d="M50 64 Q50 73 48 82" {...lp} strokeWidth="2.2"/>
      <path d="M50 62 Q56 70 62 80" {...lp} strokeWidth="2.2"/>
    </svg>
  );
}

/* ── 協調型: 3人のシルエット ─────────────────────────── */
function TeamSVG({ c }: { c: string }) {
  const lp = { stroke: c, strokeWidth: "2.5", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* 中央人物 */}
      <circle cx="50" cy="22" r="10" stroke={c} strokeWidth="2.5" fill="none"/>
      <path d="M30 50 Q50 44 70 50" {...lp}/>
      {/* 左人物 */}
      <circle cx="22" cy="54" r="8" stroke={c} strokeWidth="2.5" fill="none"/>
      <path d="M8  76 Q22 70 36 76" {...lp}/>
      {/* 右人物 */}
      <circle cx="78" cy="54" r="8" stroke={c} strokeWidth="2.5" fill="none"/>
      <path d="M64 76 Q78 70 92 76" {...lp}/>
      {/* 下部の繋がりライン */}
      <path d="M36 78 Q50 72 64 78" {...lp} strokeWidth="2"/>
    </svg>
  );
}

/* ── 探究型: 人物 + きらめく星々 ─────────────────────── */
function StarShape({ cx, cy, s, c }: { cx: number; cy: number; s: number; c: string }) {
  const p = s * 0.3;
  return (
    <path
      d={`M${cx},${cy - s} L${cx + p},${cy - p} L${cx + s},${cy} L${cx + p},${cy + p} L${cx},${cy + s} L${cx - p},${cy + p} L${cx - s},${cy} L${cx - p},${cy - p} Z`}
      fill={c}
    />
  );
}

function SpecialistSVG({ c }: { c: string }) {
  const lp = { stroke: c, strokeWidth: "2.5", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* 中央人物 */}
      <circle cx="50" cy="58" r="10" stroke={c} strokeWidth="2.5" fill="none"/>
      <path d="M32 82 Q50 76 68 82" {...lp}/>
      {/* 大きな星 (中央上) */}
      <StarShape cx={50} cy={24} s={12} c={c} />
      {/* 中くらいの星 (右上) */}
      <StarShape cx={78} cy={36} s={8}  c={c} />
      {/* 小さい星 (左) */}
      <StarShape cx={20} cy={42} s={6}  c={c} />
      {/* 小さい星 (右下) */}
      <StarShape cx={80} cy={66} s={5}  c={c} />
      {/* ドット */}
      <circle cx="28" cy="22" r="2.5" fill={c}/>
      <circle cx="74" cy="18" r="2"   fill={c}/>
      <circle cx="18" cy="64" r="2"   fill={c}/>
      <circle cx="84" cy="50" r="2"    fill={c}/>
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
  const filter = `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color})`;

  const Icon =
    type === "challenger" ? <ChallengerSVG c={color} /> :
    type === "stable"     ? <StableSVG     c={color} /> :
    type === "team"       ? <TeamSVG       c={color} /> :
                            <SpecialistSVG c={color} />;

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
      <div style={{ width: px * 0.62, height: px * 0.62, filter, position: "relative" }}>
        {Icon}
      </div>
    </div>
  );
}
