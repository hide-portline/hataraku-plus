import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Input from "@/components/ui/Input";

async function toggleRegion(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";
  const supabase = await createClient();
  await supabase.from("regions").update({ is_active: !current }).eq("id", id);
  redirect("/admin/regions");
}

async function addRegion(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = (formData.get("description") as string) || null;
  if (!name || !slug) redirect("/admin/regions");

  await supabase.from("regions").insert({
    name,
    slug,
    description,
    is_active: false,
    display_order: 99,
  });
  redirect("/admin/regions");
}

export default async function AdminRegionsPage() {
  const supabase = await createClient();
  const { data: regions } = await supabase
    .from("regions")
    .select("*")
    .order("display_order");

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">地域マスター</h1>

      {/* 既存地域一覧 */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">地域名</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">スラッグ</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">ステータス</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {regions?.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--color-surface)]">
                <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{r.name}</td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)] font-mono text-xs">{r.slug}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {r.is_active ? "公開中" : "準備中"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <form action={toggleRegion}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="current" value={String(r.is_active)} />
                    <button className="text-xs text-[var(--color-brand)] hover:underline">
                      {r.is_active ? "非公開にする" : "公開する"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新規地域追加 */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
        <h2 className="font-bold text-[var(--color-text-primary)] mb-4">新しい地域を追加</h2>
        <form action={addRegion} className="flex flex-col gap-4">
          <Input id="name" name="name" label="地域名 *" placeholder="例: Hataraku+徳島" required />
          <Input id="slug" name="slug" label="スラッグ *" placeholder="例: tokushima" required />
          <Input id="description" name="description" label="説明" placeholder="例: 徳島県全域を対象としたエリア" />
          <button
            type="submit"
            className="py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-colors"
          >
            追加する（初期状態: 準備中）
          </button>
        </form>
      </div>
    </div>
  );
}
