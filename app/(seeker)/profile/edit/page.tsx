import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("users").update({
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || null,
    bio: (formData.get("bio") as string) || null,
    desired_location: (formData.get("desired_location") as string) || null,
    employment_type_pref: (formData.get("employment_type_pref") as string) || null,
  }).eq("id", user.id);

  redirect("/mypage");
}

const TEXTAREA_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors resize-none";
const SELECT_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm bg-white outline-none focus:border-[var(--color-brand)]";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/mypage");

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/mypage" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← マイページ</Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">プロフィール編集</h1>
        </div>

        <form action={saveProfile} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-5">
          <Input id="name" name="name" label="氏名 *" defaultValue={profile.name} required />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">メールアドレス</label>
            <p className="text-sm text-[var(--color-text-secondary)] px-3 py-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
              {profile.email}
            </p>
          </div>
          <Input id="phone" name="phone" label="電話番号" type="tel" defaultValue={profile.phone ?? ""} placeholder="090-0000-0000" />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">自己紹介</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile.bio ?? ""}
              placeholder="あなたの経験・スキル・仕事への想いを書いてください"
              className={TEXTAREA_CLASS}
            />
          </div>
          <Input id="desired_location" name="desired_location" label="希望勤務地" defaultValue={profile.desired_location ?? ""} placeholder="例: 淡路島・神戸市内" />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">希望雇用形態</label>
            <select name="employment_type_pref" defaultValue={profile.employment_type_pref ?? ""} className={SELECT_CLASS}>
              <option value="">未選択</option>
              <option value="fulltime">正社員</option>
              <option value="parttime">パート・アルバイト</option>
              <option value="contract">契約社員</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <Link href="/mypage" className="flex-1">
              <Button type="button" variant="outline" className="w-full">キャンセル</Button>
            </Link>
            <Button type="submit" variant="primary" className="flex-1">保存する</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
