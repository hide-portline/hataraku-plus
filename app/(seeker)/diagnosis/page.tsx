import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DiagnosisWizard from "@/components/diagnosis/DiagnosisWizard";

export const metadata: Metadata = {
  title: "価値観診断",
  description: "20問に答えて、あなたの価値観タイプを診断。淡路島の企業とのマッチングスコアがわかります。",
};

export default async function DiagnosisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/diagnosis");

  // 診断済みなら結果ページへ（再診断はそちらから）
  const { data: existing } = await supabase
    .from("user_diagnosis_results")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) redirect("/diagnosis/result");

  const { data: questions } = await supabase
    .from("diagnosis_questions")
    .select("*, diagnosis_options(*)")
    .eq("is_active", true)
    .order("order");

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-[var(--color-text-muted)]">
        <p className="text-4xl mb-4">🔧</p>
        <p className="font-semibold">診断を準備中です</p>
        <p className="text-sm mt-1">しばらくお待ちください。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[var(--color-brand)] text-white text-center py-10">
        <h1 className="text-2xl font-bold">価値観診断</h1>
        <p className="text-white/70 text-sm mt-1">20問に答えて、あなたに合う企業を見つけましょう</p>
      </div>
      <DiagnosisWizard questions={questions} />
    </div>
  );
}
