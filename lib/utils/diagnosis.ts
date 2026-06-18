import type { ValuesType } from "@/types/database";

export type DiagnosisAnswer = {
  questionId: string;
  optionId: string;
  score: number;
  category: ValuesType;
};

export type DiagnosisScores = {
  challenger: number;
  stable: number;
  team: number;
  specialist: number;
};

export function calcScores(answers: DiagnosisAnswer[]): DiagnosisScores {
  return answers.reduce(
    (acc, a) => ({ ...acc, [a.category]: acc[a.category] + a.score }),
    { challenger: 0, stable: 0, team: 0, specialist: 0 }
  );
}

export function dominantType(scores: DiagnosisScores): ValuesType {
  return (Object.entries(scores) as [ValuesType, number][]).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
}

export const VALUES_TYPE_LABELS: Record<ValuesType, string> = {
  challenger: "Challenger（挑戦型）",
  stable:     "Stable（安定型）",
  team:       "Team（協調型）",
  specialist: "Specialist（専門型）",
};

export const VALUES_TYPE_DESCRIPTIONS: Record<ValuesType, string> = {
  challenger: "変化を恐れず挑戦し続ける。高い目標に向かって積極的に動ける環境で力を発揮します。",
  stable:     "安定した環境で長期的に成果を出す。ルールと信頼関係を大切に、着実に積み上げます。",
  team:       "人との繋がりを大切に、協力しながら目標を達成する。職場の雰囲気と関係性を重視します。",
  specialist: "深い専門知識を磨き、プロとして高品質な仕事をする。継続的な成長と評価を求めます。",
};

export const VALUES_TYPE_COLORS: Record<ValuesType, string> = {
  challenger: "bg-[--color-accent]/10 text-[--color-accent-dark] border-[--color-accent]/30",
  stable:     "bg-[--color-brand]/10 text-[--color-brand] border-[--color-brand]/30",
  team:       "bg-green-100 text-green-700 border-green-200",
  specialist: "bg-purple-100 text-purple-700 border-purple-200",
};

export const VALUES_TYPE_ICONS: Record<ValuesType, string> = {
  challenger: "Challenger",
  stable:     "Stable",
  team:       "Team",
  specialist: "Specialist",
};
