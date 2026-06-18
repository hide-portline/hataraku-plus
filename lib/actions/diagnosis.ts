"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcScores, dominantType } from "@/lib/utils/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";

export async function submitUserDiagnosis(answers: DiagnosisAnswer[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const scores = calcScores(answers);
  const type = dominantType(scores);

  // 回答を保存
  await supabase.from("user_diagnosis_answers").insert(
    answers.map((a) => ({
      user_id: user.id,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );

  // 結果を保存（既存は上書き）
  await supabase.from("user_diagnosis_results").upsert({
    user_id: user.id,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  }, { onConflict: "user_id" });

  redirect("/diagnosis/result");
}

export async function submitCompanyDiagnosis(companyId: string, answers: DiagnosisAnswer[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const scores = calcScores(answers);
  const type = dominantType(scores);

  await supabase.from("company_diagnosis_answers").insert(
    answers.map((a) => ({
      company_id: companyId,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );

  await supabase.from("company_diagnosis_results").upsert({
    company_id: companyId,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  }, { onConflict: "company_id" });

  // 企業の values_type も更新
  await supabase.from("companies").update({ values_type: type }).eq("id", companyId);

  return { success: true };
}
