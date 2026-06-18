import type { ValuesType } from "@/types/database";
import { VALUES_TYPE_LABELS, VALUES_TYPE_ICONS, VALUES_TYPE_COLORS } from "@/lib/utils/diagnosis";

type Props = { type: ValuesType; size?: "sm" | "md" };

export default function ValuesTypeBadge({ type, size = "sm" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border
        ${VALUES_TYPE_COLORS[type]}
        ${size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1"}`}
    >
      <span>{VALUES_TYPE_ICONS[type]}</span>
      {VALUES_TYPE_LABELS[type]}
    </span>
  );
}
