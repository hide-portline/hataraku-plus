import type { ValuesType } from "@/types/database";
import {
  VALUES_TYPE_LABELS,
  VALUES_TYPE_DESCRIPTIONS,
  VALUES_TYPE_ICONS,
  VALUES_TYPE_COLORS,
  type DiagnosisScores,
} from "@/lib/utils/diagnosis";

const SCORE_COLORS: Record<ValuesType, string> = {
  challenger: "bg-[var(--color-accent)]",
  stable:     "bg-[var(--color-brand)]",
  team:       "bg-green-500",
  specialist: "bg-purple-500",
};

export default function ResultCard({
  type,
  scores,
}: {
  type: ValuesType;
  scores: DiagnosisScores;
}) {
  const MAX = 20;
  const entries = Object.entries(scores) as [ValuesType, number][];

  return (
    <div className="max-w-2xl mx-auto">
      {/* メインタイプ */}
      <div className={`rounded-2xl border-2 p-8 mb-6 text-center ${VALUES_TYPE_COLORS[type]}`}>
        <div className="text-5xl mb-3">{VALUES_TYPE_ICONS[type]}</div>
        <p className="text-sm font-semibold mb-1 opacity-70">あなたのタイプ</p>
        <h2 className="text-3xl font-bold mb-4">{VALUES_TYPE_LABELS[type]}</h2>
        <p className="text-sm leading-relaxed opacity-80 max-w-md mx-auto">
          {VALUES_TYPE_DESCRIPTIONS[type]}
        </p>
      </div>

      {/* スコアバー */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">タイプ別スコア</h3>
        <div className="flex flex-col gap-4">
          {entries
            .sort(([, a], [, b]) => b - a)
            .map(([t, score]) => (
              <div key={t}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {VALUES_TYPE_ICONS[t]} {VALUES_TYPE_LABELS[t]}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">{score} / {MAX}</span>
                </div>
                <div className="h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${SCORE_COLORS[t]}`}
                    style={{ width: `${(score / MAX) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
