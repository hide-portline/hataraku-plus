"use client";

import type { ValuesType } from "@/types/database";

const CONFIG: Record<ValuesType, { color: string; glow: string }> = {
  challenger: { color: "#FF7A00", glow: "rgba(255,122,0,0.5)"   },
  stable:     { color: "#4ADE4A", glow: "rgba(74,222,74,0.5)"   },
  team:       { color: "#00AAFF", glow: "rgba(0,170,255,0.5)"   },
  specialist: { color: "#9966FF", glow: "rgba(153,102,255,0.45)" },
};

/* ── 挑戦型: 疾走する人物 + 稲妻 ─────────────────── */
function ChallengerSVG({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* head */}
      <circle cx="46" cy="18" r="9" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* torso */}
      <line x1="46" y1="27" x2="41" y2="52" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* back leg */}
      <line x1="41" y1="52" x2="30" y2="72" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* front leg */}
      <line x1="41" y1="52" x2="55" y2="70" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* back arm */}
      <line x1="25" y1="39" x2="41" y2="43" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* front arm – reaching forward */}
      <line x1="41" y1="43" x2="63" y2="33" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* lightning bolt */}
      <path d="M72 12 L60 38 L66 38 L54 64 L78 34 L71 34 Z"
        fill={c} stroke={c} strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── 安定型: 芽吹く植物 + 根 ─────────────────────── */
function StableSVG({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* ground line */}
      <line x1="18" y1="62" x2="82" y2="62" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* stem */}
      <line x1="50" y1="62" x2="50" y2="28" stroke={c} strokeWidth="2.8" strokeLinecap="round"/>
      {/* left leaf */}
      <path d="M50 45 Q36 34 28 18 Q42 22 50 45Z"
        stroke={c} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* right leaf */}
      <path d="M50 40 Q64 28 72 13 Q58 17 50 40Z"
        stroke={c} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* top bud */}
      <path d="M50 28 Q46 14 50 8 Q54 14 50 28Z"
        stroke={c} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* roots */}
      <path d="M50 62 Q42 71 34 82" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M50 64 Q50 74 48 84" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M50 62 Q58 73 66 82" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── 協調型: 3人が円を描く ────────────────────────── */
function TeamSVG({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* center figure */}
      <circle cx="50" cy="24" r="8.5" stroke={c} strokeWidth="2.5"/>
      <path d="M37 50 Q50 43 63 50" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* left figure */}
      <circle cx="22" cy="32" r="6.5" stroke={c} strokeWidth="2.5"/>
      <path d="M11 55 Q22 49 33 55" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* right figure */}
      <circle cx="78" cy="32" r="6.5" stroke={c} strokeWidth="2.5"/>
      <path d="M67 55 Q78 49 89 55" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* outer connecting arc */}
      <path d="M14 73 Q50 62 86 73" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── 探究型: きらめく星々 ─────────────────────────── */
function Sparkle({ cx, cy, s, c }: { cx: number; cy: number; s: number; c: string }) {
  const p = s * 0.28;
  return (
    <path
      d={`M${cx},${cy - s} L${cx + p},${cy - p} L${cx + s},${cy} L${cx + p},${cy + p} L${cx},${cy + s} L${cx - p},${cy + p} L${cx - s},${cy} L${cx - p},${cy - p} Z`}
      fill={c}
    />
  );
}

function SpecialistSVG({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <Sparkle cx={50} cy={34} s={16} c={c} />
      <Sparkle cx={22} cy={64} s={9}  c={c} />
      <Sparkle cx={76} cy={58} s={11} c={c} />
      <Sparkle cx={40} cy={76} s={7}  c={c} />
      <circle cx={68} cy={22} r={3} fill={c}/>
      <circle cx={82} cy={72} r={2.5} fill={c}/>
      <circle cx={18} cy={35} r={2} fill={c}/>
      <circle cx={60} cy={80} r={2} fill={c}/>
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
