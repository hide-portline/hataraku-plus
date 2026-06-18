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

  // 企業診断済みの企業に対してマッチングスコアを計算・保存
  const { data: diagnosedCompanies } = await supabase
    .from("company_diagnosis_results")
    .select("company_id");

  if (diagnosedCompanies && diagnosedCompanies.length > 0) {
    const scoreRows: { user_id: string; company_id: string; score: number }[] = [];
    for (const { company_id } of diagnosedCompanies) {
      const { data: score } = await supabase.rpc("calculate_matching_score", {
        p_user_id: user.id,
        p_company_id: company_id,
      });
      if (score !== null) {
        scoreRows.push({ user_id: user.id, company_id, score });
      }
    }
    if (scoreRows.length > 0) {
      await supabase.from("matching_scores").upsert(scoreRows, { onConflict: "user_id,company_id" });
    }
  }

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
