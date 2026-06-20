"use client";

import Image from "next/image";
import type { ValuesType } from "@/types/database";

const CONFIG: Record<ValuesType, { color: string; glow: string }> = {
  challenger: { color: "#FF7A00", glow: "rgba(255,122,0,0.5)"   },
  stable:     { color: "#4ADE4A", glow: "rgba(74,222,74,0.5)"   },
  team:       { color: "#00AAFF", glow: "rgba(0,170,255,0.5)"   },
  specialist: { color: "#9966FF", glow: "rgba(153,102,255,0.45)" },
};

const ICON_SRC: Record<ValuesType, string> = {
  challenger: "/icons/challenger.png",
  stable:     "/icons/stable.jpg",
  team:       "/icons/team.png",
  specialist: "/icons/explorer.png",
};

const SIZES = { sm: 64, md: 120, lg: 200 };

type Props = {
  type: ValuesType;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function NeonTypeIcon({ type, size = "md", className = "" }: Props) {
  const { color, glow } = CONFIG[type];
  const px = SIZES[size];
  const glowFilter = `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 18px ${color})`;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-black ${className}`}
      style={{ width: px, height: px, flexShrink: 0 }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle at center, ${glow} 0%, transparent 68%)` }}
      />
      <div
        style={{
          width: px * 0.72,
          height: px * 0.72,
          filter: glowFilter,
          position: "relative",
          mixBlendMode: "screen",
        }}
      >
        <Image
          src={ICON_SRC[type]}
          alt={type}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
