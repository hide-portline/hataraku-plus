import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createJobSchema } from "@/lib/validations/job";

async function createJob(formData: FormData) {
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

  const raw = Object.fromEntries(formData);
  const result = createJobSchema.safeParse(raw);
  if (!result.success) throw new Error(result.error.issues[0].message);

  const { error } = await supabase.from("jobs").insert({
    company_id: membership.company_id,
    ...result.data,
    is_published: false,
  });
  if (error) throw new Error(error.message);

  redirect("/company/jobs");
}

const SELECT_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm bg-white outline-none focus:border-[var(--color-brand)] transition-colors";
const TEXTAREA_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors resize-none";

export default function NewJobPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/company/jobs" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← 求人一覧</a>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">新規求人を作成</h1>
      </div>

      <form action={createJob} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-5">
        <Input id="title" name="title" label="求人タイトル *" placeholder="例: ホールスタッフ（週3日〜）" required />

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">雇用形態 *</label>
          <select name="employment_type" required className={SELECT_CLASS}>
            <option value="">選択してください</option>
            <option value="fulltime">正社員</option>
            <option value="parttime">パート・アルバイト</option>
            <option value="contract">契約社員</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input id="salary_min" name="salary_min" label="給与下限（円/月）" type="number" placeholder="例: 200000" />
          <Input id="salary_max" name="salary_max" label="給与上限（円/月）" type="number" placeholder="例: 300000" />
        </div>

        <Input id="location" name="location" label="勤務地" placeholder="例: 兵庫県淡路市" />

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">求人詳細</label>
          <textarea name="description" rows={5} placeholder="仕事内容・職場環境などを記入してください" className={TEXTAREA_CLASS} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">必要なスキル・経験</label>
          <textarea name="required_skills" rows={3} placeholder="例: 接客経験不問、高校生歓迎" className={TEXTAREA_CLASS} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">福利厚生・待遇</label>
          <textarea name="benefits" rows={3} placeholder="例: 社会保険完備、交通費支給" className={TEXTAREA_CLASS} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">働き方</label>
            <select name="work_style" className={SELECT_CLASS}>
              <option value="">未選択</option>
              <option value="onsite">出社</option>
              <option value="remote">リモート</option>
              <option value="hybrid">ハイブリッド</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">価値観タイプ</label>
            <select name="values_type" className={SELECT_CLASS}>
              <option value="">未選択</option>
              <option value="challenger">チャレンジャー</option>
              <option value="stable">スタビル</option>
              <option value="team">チーム</option>
              <option value="specialist">スペシャリスト</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <a href="/company/jobs" className="flex-1">
            <Button type="button" variant="outline" className="w-full">キャンセル</Button>
          </a>
          <Button type="submit" variant="primary" className="flex-1">下書きとして保存</Button>
        </div>
      </form>
    </div>
  );
}
