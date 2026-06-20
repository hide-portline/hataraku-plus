"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcScores, dominantType } from "@/lib/utils/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";
import { submitDiagnosisSchema, submitCompanyDiagnosisSchema } from "@/lib/validations/diagnosis";

export async function retakeDiagnosis() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("user_diagnosis_answers").delete().eq("user_id", user.id);
  await supabase.from("user_diagnosis_results").delete().eq("user_id", user.id);

  redirect("/diagnosis");
}

export async function submitUserDiagnosis(
  answers: DiagnosisAnswer[]
): Promise<{ redirectTo: string } | { error: string }> {
  const result = submitDiagnosisSchema.safeParse({ answers });
  if (!result.success) return { error: result.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { redirectTo: "/login" };

  // public.users にレコードがない場合（トリガー漏れ対策）作成する
  await supabase.from("users").upsert({
    id: user.id,
    name: (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? "ユーザー",
    email: user.email!,
  }, { onConflict: "id" });

  // 二重送信防止: 既に結果が存在する場合はそのまま結果ページへ
  const { data: existing } = await supabase
    .from("user_diagnosis_results")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { redirectTo: "/diagnosis/result" };

  const validatedAnswers = result.data.answers;
  const scores = calcScores(validatedAnswers);
  const type = dominantType(scores);

  // 古い回答を削除してから保存（ページ戻りによる重複防止）
  await supabase.from("user_diagnosis_answers").delete().eq("user_id", user.id);
  const { error: insertError } = await supabase.from("user_diagnosis_answers").insert(
    validatedAnswers.map((a) => ({
      user_id: user.id,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );
  if (insertError) return { error: insertError.message };

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
  if (upsertError) return { error: upsertError.message };

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

  return { redirectTo: "/diagnosis/result" };
}

export async function submitCompanyDiagnosis(companyId: string, answers: DiagnosisAnswer[]) {
  const result = submitCompanyDiagnosisSchema.safeParse({ companyId, answers });
  if (!result.success) throw new Error(result.error.issues[0].message);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { companyId: validCompanyId, answers: validAnswers } = result.data;

  // 所有権チェック: ログインユーザーがこの企業のメンバーか検証
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", validCompanyId)
    .single();
  if (!membership) throw new Error("権限がありません");

  const scores = calcScores(validAnswers);
  const type = dominantType(scores);

  await supabase.from("company_diagnosis_answers").delete().eq("company_id", validCompanyId);
  const { error: insertError } = await supabase.from("company_diagnosis_answers").insert(
    validAnswers.map((a) => ({
      company_id: validCompanyId,
      question_id: a.questionId,
      option_id: a.optionId,
      score: a.score,
    }))
  );
  if (insertError) throw new Error(insertError.message);

  const { error: upsertError } = await supabase.from("company_diagnosis_results").upsert({
    company_id: validCompanyId,
    values_type: type,
    score_challenger: scores.challenger,
    score_stable: scores.stable,
    score_team: scores.team,
    score_specialist: scores.specialist,
  }, { onConflict: "company_id" });
  if (upsertError) throw new Error(upsertError.message);

  const { error: updateCompanyError } = await supabase.from("companies").update({ values_type: type }).eq("id", validCompanyId);
  if (updateCompanyError) throw new Error(updateCompanyError.message);

  return { success: true };
}
