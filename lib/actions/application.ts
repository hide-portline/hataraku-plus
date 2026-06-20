"use server";

import { createClient } from "@/lib/supabase/server";
import { sendApplicationReceived, sendApplicationConfirm } from "@/lib/email/send";
import { applyToJobSchema, updateStatusSchema } from "@/lib/validations/application";
import { logError } from "@/lib/monitoring";
import type { ApplicationStatus } from "@/types/database";

export async function applyToJob(jobId: string, message?: string) {
  const result = applyToJobSchema.safeParse({ jobId, message });
  if (!result.success) return { error: result.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    job_id: result.data.jobId,
    status: "applied" as const,
    message: result.data.message ?? null,
  });
  if (error) {
    if (error.code === "23505") return { error: "すでに応募済みです" };
    return { error: "応募に失敗しました" };
  }

  const [{ data: seeker }, { data: job }] = await Promise.all([
    supabase.from("users").select("name, email").eq("id", user.id).single(),
    supabase.from("jobs")
      .select("title, company_id, companies(company_name, contact_email)")
      .eq("id", result.data.jobId)
      .single(),
  ]);

  if (seeker && job && job.companies) {
    const company = Array.isArray(job.companies) ? job.companies[0] : job.companies as { company_name: string; contact_email: string };
    // メール送信失敗は握り潰さずコンソールに記録
    await Promise.all([
      sendApplicationReceived({
        companyEmail: company.contact_email,
        companyName: company.company_name,
        seekerName: seeker.name,
        jobTitle: job.title,
        applicationId: result.data.jobId,
      }),
      sendApplicationConfirm({
        seekerEmail: seeker.email,
        seekerName: seeker.name,
        jobTitle: job.title,
        companyName: company.company_name,
      }),
    ]).catch(logError("applyToJob:sendMail"));
  }

  return { success: true };
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const result = updateStatusSchema.safeParse({ applicationId, status });
  if (!result.success) return { success: false, error: result.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "認証が必要です" };

  // ログインユーザーが所属する企業の求人への応募のみ更新可能
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!membership) return { success: false, error: "権限がありません" };

  const { data: application } = await supabase
    .from("applications")
    .select("job_id, jobs(company_id)")
    .eq("id", result.data.applicationId)
    .single();

  const jobCompanyId = application?.jobs
    ? (Array.isArray(application.jobs)
        ? application.jobs[0]?.company_id
        : (application.jobs as { company_id: string }).company_id)
    : null;

  if (!jobCompanyId || jobCompanyId !== membership.company_id) {
    return { success: false, error: "権限がありません" };
  }

  const { error } = await supabase
    .from("applications")
    .update({ status: result.data.status as ApplicationStatus, updated_at: new Date().toISOString() })
    .eq("id", result.data.applicationId);

  return { success: !error, error: error?.message };
}
