"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcScores, dominantType } from "@/lib/utils/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";

export async function submitUserDiagnosis(answers: DiagnosisAnswer[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const scores = calcScores(answers);
  const type = dominantType(scores);

  // 回答を保存
  const { error: insertError } = await supabase.from("user_diagnosis_answers").insert(
    answers.map((a) => ({
      user_id: user.id,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );
  if (insertError) throw new Error(insertError.message);

  // 結果を保存（既存は上書き）
  const { error: upsertError } = await supabase.from("user_diagnosis_results").upsert({
    user_id: user.id,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  }, { onConflict: "user_id" });
  if (upsertError) throw new Error(upsertError.message);

  redirect("/diagnosis/result");
}

export async function submitCompanyDiagnosis(companyId: string, answers: DiagnosisAnswer[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const scores = calcScores(answers);
  const type = dominantType(scores);

  const { error: insertError } = await supabase.from("company_diagnosis_answers").insert(
    answers.map((a) => ({
      company_id: companyId,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );
  if (insertError) throw new Error(insertError.message);

  const { error: upsertError } = await supabase.from("company_diagnosis_results").upsert({
    company_id: companyId,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  }, { onConflict: "company_id" });
  if (upsertError) throw new Error(upsertError.message);

  const { error: updateCompanyError } = await supabase.from("companies").update({ values_type: type }).eq("id", companyId);
  if (updateCompanyError) throw new Error(updateCompanyError.message);

  return { success: true };
}
