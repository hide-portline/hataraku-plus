"use client";

import { useState } from "react";
import { submitUserDiagnosis } from "@/lib/actions/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";
import type { ValuesType } from "@/types/database";

type Option = { id: string; label: string; score: number; order: number };
type Question = {
  id: string;
  question: string;
  category: ValuesType;
  order: number;
  diagnosis_options: Option[];
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function DiagnosisWizard({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = questions[index];
  const progress = ((index) / questions.length) * 100;
  const isLast = index === questions.length - 1;

  const existingAnswer = answers.find((a) => a.questionId === current.id);

  const handleSelect = (opt: Option) => setSelected(opt.id);

  const handleNext = async () => {
    if (!selected) return;
    const opt = current.diagnosis_options.find((o) => o.id === selected)!;
    const newAnswer: DiagnosisAnswer = {
      questionId: current.id,
      optionId: selected,
      score: opt.score,
      category: current.category,
    };
    const updated = [
      ...answers.filter((a) => a.questionId !== current.id),
      newAnswer,
    ];
    setAnswers(updated);

    if (isLast) {
      setSubmitting(true);
      await submitUserDiagnosis(updated);
    } else {
      setIndex(index + 1);
      const next = questions[index + 1];
      const nextExisting = updated.find((a) => a.questionId === next.id);
      setSelected(nextExisting?.optionId ?? null);
    }
  };

  const handleBack = () => {
    const prev = questions[index - 1];
    const prevAnswer = answers.find((a) => a.questionId === prev.id);
    setSelected(prevAnswer?.optionId ?? null);
    setIndex(index - 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2">
          <span>質問 {index + 1} / {questions.length}</span>
          <span>{Math.round(progress)}% 完了</span>
        </div>
        <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 質問カード */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8 mb-6">
        <p className="text-sm font-semibold text-[var(--color-brand)] mb-4">
          Q{current.order}
        </p>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] leading-relaxed mb-8">
          {current.question}
        </h2>

        {/* 選択肢 */}
        <div className="flex flex-col gap-3">
          {[...current.diagnosis_options]
            .sort((a, b) => a.order - b.order)
            .map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border-2 transition-all
                  ${selected === opt.id
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)]/5"
                    : "border-[var(--color-border)] hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-surface)]"
                  }`}
              >
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-colors
                  ${selected === opt.id
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className="text-sm text-[var(--color-text-primary)]">{opt.label.replace(/^[A-D]\. /, "")}</span>
              </button>
            ))}
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="flex gap-3">
        {index > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            ← 前の質問
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selected || submitting}
          className="flex-1 py-3 rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "集計中..." : isLast ? "診断結果を見る →" : "次の質問 →"}
        </button>
      </div>
    </div>
  );
}
