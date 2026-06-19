"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcScores, dominantType } from "@/lib/utils/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";

export async function retakeDiagnosis() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("user_diagnosis_answers").delete().eq("user_id", user.id);
  await supabase.from("user_diagnosis_results").delete().eq("user_id", user.id);

  redirect("/diagnosis");
}

export async function submitUserDiagnosis(answers: DiagnosisAnswer[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // public.users にレコードがない場合（トリガー漏れ対策）作成する
  await supabase.from("users").upsert({
    id: user.id,
    name: (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? "ユーザー",
    email: user.email!,
  }, { onConflict: "id" });

  // 二重送信防止: 既に結果が存在する場合は処理しない
  const { data: existing } = await supabase
    .from("user_diagnosis_results")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) redirect("/diagnosis/result");

  const scores = calcScores(answers);
  const type = dominantType(scores);

  // 古い回答を削除してから保存（ページ戻りによる重複防止）
  await supabase.from("user_diagnosis_answers").delete().eq("user_id", user.id);
  const { error: insertError } = await supabase.from("user_diagnosis_answers").insert(
    answers.map((a) => ({
      user_id: user.id,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );
  if (insertError) throw new Error(insertError.message);

  // 結果を保存（既存があれば削除してから挿入）
  await supabase.from("user_diagnosis_results").delete().eq("user_id", user.id);
  const { error: upsertError } = await supabase.from("user_diagnosis_results").insert({
    user_id: user.id,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  });
  if (upsertError) throw new Error(upsertError.message);

  // 全企業のマッチングスコアを1回のRPCで一括計算・保存（N+1解消）
  const { data: allScores } = await supabase.rpc("calculate_all_matching_scores", {
    p_user_id: user.id,
  });
  if (allScores && allScores.length > 0) {
    const scoreRows = (allScores as { company_id: string; score: number }[]).map((s) => ({
      user_id: user.id,
      company_id: s.company_id,
      score: s.score,
    }));
    await supabase.from("matching_scores").upsert(scoreRows, { onConflict: "user_id,company_id" });
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
