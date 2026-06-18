import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const employeeCount = formData.get("employee_count") as string;
  const foundedYear = formData.get("founded_year") as string;

  await supabase.from("companies").update({
    company_name: formData.get("company_name") as string,
    industry: (formData.get("industry") as string) || null,
    description: (formData.get("description") as string) || null,
    vision: (formData.get("vision") as string) || null,
    culture_description: (formData.get("culture_description") as string) || null,
    location: (formData.get("location") as string) || null,
    website_url: (formData.get("website_url") as string) || null,
    employee_count: employeeCount ? Number(employeeCount) : null,
    founded_year: foundedYear ? Number(foundedYear) : null,
  }).eq("id", membership.company_id);

  redirect("/dashboard");
}

const TEXTAREA_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors resize-none";

export default async function CompanyProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id, companies(*)")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const company = Array.isArray(membership.companies) ? membership.companies[0] : membership.companies;
  if (!company) redirect("/dashboard");

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/dashboard" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← ダッシュボード</a>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">企業情報を編集</h1>
      </div>

      <form action={saveProfile} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-5">
        <Input id="company_name" name="company_name" label="企業名 *" defaultValue={company.company_name} required />
        <Input id="industry" name="industry" label="業種" defaultValue={company.industry ?? ""} placeholder="例: 飲食・フード" />
        <Input id="location" name="location" label="所在地" defaultValue={company.location ?? ""} placeholder="例: 兵庫県淡路市" />
        <Input id="website_url" name="website_url" label="ウェブサイトURL" type="url" defaultValue={company.website_url ?? ""} placeholder="https://example.com" />

        <div className="grid grid-cols-2 gap-4">
          <Input id="employee_count" name="employee_count" label="従業員数（名）" type="number" defaultValue={company.employee_count?.toString() ?? ""} />
          <Input id="founded_year" name="founded_year" label="設立年" type="number" defaultValue={company.founded_year?.toString() ?? ""} placeholder="例: 2010" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">企業紹介</label>
          <textarea name="description" rows={4} defaultValue={company.description ?? ""} placeholder="どんな会社かを紹介してください" className={TEXTAREA_CLASS} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">ビジョン・理念</label>
          <textarea name="vision" rows={3} defaultValue={company.vision ?? ""} placeholder="会社のビジョンや理念を書いてください" className={TEXTAREA_CLASS} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">社風・文化</label>
          <textarea name="culture_description" rows={3} defaultValue={company.culture_description ?? ""} placeholder="どんな雰囲気の職場ですか？" className={TEXTAREA_CLASS} />
        </div>

        <div className="flex gap-3 mt-2">
          <a href="/dashboard" className="flex-1">
            <Button type="button" variant="outline" className="w-full">キャンセル</Button>
          </a>
          <Button type="submit" variant="primary" className="flex-1">保存する</Button>
        </div>
      </form>
    </div>
  );
}
