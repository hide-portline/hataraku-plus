import type { ValuesType } from "@/types/database";
import { VALUES_TYPE_COLORS } from "@/lib/utils/diagnosis";

const shortLabel: Record<ValuesType, string> = {
  challenger: "挑戦型",
  stable:     "安定型",
  team:       "協調型",
  specialist: "探究型",
};

type Props = { type: ValuesType; size?: "sm" | "md" };

export default function ValuesTypeBadge({ type, size = "sm" }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[var(--color-text-secondary)] font-semibold tracking-wide ${size === "sm" ? "text-[10px]" : "text-xs px-3 py-1"} ${VALUES_TYPE_COLORS[type]}`}>
      {shortLabel[type]}
    </span>
  );
}
