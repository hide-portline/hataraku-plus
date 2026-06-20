import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Button from "@/components/ui/Button";
import { z } from "zod";

const companyIdSchema = z.string().uuid("無効な企業IDです");

async function assertAdmin() {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean) ?? [];
  if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
    throw new Error("管理者権限がありません");
  }
}

async function approveCompany(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = companyIdSchema.parse(formData.get("id"));
  const admin = createAdminClient();
  await admin.from("companies").update({
    status: "approved" as const,
    approved_at: new Date().toISOString(),
  }).eq("id", id);
  redirect("/admin/companies");
}

async function rejectCompany(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = companyIdSchema.parse(formData.get("id"));
  const reason = z.string().max(1000).parse(formData.get("reason") ?? "");
  const admin = createAdminClient();
  await admin.from("companies").update({
    status: "rejected" as const,
    rejection_reason: reason || null,
  }).eq("id", id);
  redirect("/admin/companies");
}

export default async function AdminCompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("id", id)
    .single();

  if (!company) notFound();

  const region = Array.isArray(company.regions) ? company.regions[0] : company.regions;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/companies" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← 企業一覧</a>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full
          ${company.status === "pending" ? "bg-amber-100 text-amber-700" :
            company.status === "approved" ? "bg-green-100 text-green-700" :
            "bg-red-100 text-red-700"}`}>
          {company.status === "pending" ? "審査待ち" : company.status === "approved" ? "承認済み" : "非承認"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">{company.company_name}</h1>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[var(--color-text-muted)]">地域</dt><dd className="font-medium">{region?.name ?? "-"}</dd></div>
          <div><dt className="text-[var(--color-text-muted)]">業種</dt><dd className="font-medium">{company.industry ?? "-"}</dd></div>
          <div><dt className="text-[var(--color-text-muted)]">連絡先メール</dt><dd className="font-medium">{company.contact_email}</dd></div>
          <div><dt className="text-[var(--color-text-muted)]">従業員数</dt><dd className="font-medium">{company.employee_count ?? "-"}名</dd></div>
          <div><dt className="text-[var(--color-text-muted)]">設立年</dt><dd className="font-medium">{company.founded_year ?? "-"}年</dd></div>
          <div><dt className="text-[var(--color-text-muted)]">登録日</dt><dd className="font-medium">{new Date(company.created_at).toLocaleDateString("ja-JP")}</dd></div>
        </dl>
        {company.description && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">企業説明</p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{company.description}</p>
          </div>
        )}
      </div>

      {company.status === "pending" && (
        <div className="flex flex-col gap-4">
          <form action={approveCompany}>
            <input type="hidden" name="id" value={company.id} />
            <Button type="submit" variant="primary" className="w-full">✓ 承認して公開する</Button>
          </form>

          <form action={rejectCompany} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={company.id} />
            <textarea
              name="reason"
              placeholder="非承認理由（企業に通知されません）"
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-red-400"
              rows={3}
            />
            <Button type="submit" variant="outline" className="border-red-400 text-red-500 hover:bg-red-50 hover:border-red-400 w-full">
              非承認にする
            </Button>
          </form>
        </div>
      )}

      {company.rejection_reason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <p className="font-semibold mb-1">非承認理由</p>
          <p>{company.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}
