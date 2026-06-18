"use server";

import { createClient } from "@/lib/supabase/server";
import { sendApplicationReceived, sendApplicationConfirm } from "@/lib/email/send";

export async function applyToJob(jobId: string, message?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  // 応募レコード作成
  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    job_id: jobId,
    status: "applied" as const,
    message: message ?? null,
  });
  if (error) {
    if (error.code === "23505") return { error: "すでに応募済みです" };
    return { error: "応募に失敗しました" };
  }

  // 求職者情報・求人情報を取得してメール送信
  const [{ data: seeker }, { data: job }] = await Promise.all([
    supabase.from("users").select("name, email").eq("id", user.id).single(),
    supabase.from("jobs")
      .select("title, company_id, companies(company_name, contact_email)")
      .eq("id", jobId)
      .single(),
  ]);

  if (seeker && job && job.companies) {
    const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
    await Promise.all([
      sendApplicationReceived({
        companyEmail: company.contact_email,
        companyName: company.company_name,
        seekerName: seeker.name,
        jobTitle: job.title,
        applicationId: jobId,
      }),
      sendApplicationConfirm({
        seekerEmail: seeker.email,
        seekerName: seeker.name,
        jobTitle: job.title,
        companyName: company.company_name,
      }),
    ]);
  }

  return { success: true };
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: status as import("@/types/database").ApplicationStatus, updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  return { success: !error, error: error?.message };
}
