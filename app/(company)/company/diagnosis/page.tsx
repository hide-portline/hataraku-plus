import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompanyDiagnosisWizard from "@/components/diagnosis/CompanyDiagnosisWizard";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";

export default async function CompanyDiagnosisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id, companies(values_type)")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const company = Array.isArray(membership.companies) ? membership.companies[0] : membership.companies;
  const companyId = membership.company_id;

  const { data: questions } = await supabase
    .from("diagnosis_questions")
    .select("*, diagnosis_options(*)")
    .eq("is_active", true)
    .order("order");

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-[var(--color-text-muted)]">
        <p className="text-4xl mb-4">🔧</p>
        <p className="font-semibold">診断を準備中です</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[var(--color-brand)] text-white text-center py-10">
        <h1 className="text-2xl font-bold">企業の価値観診断</h1>
        <p className="text-white/70 text-sm mt-1">貴社に合った求職者とマッチングするために診断してください</p>
        {company?.values_type && (
          <div className="mt-3 flex justify-center">
            <div className="bg-white/10 rounded-full px-4 py-1.5 text-sm">
              現在のタイプ: <span className="font-semibold">{company.values_type}</span>
            </div>
          </div>
        )}
      </div>
      <CompanyDiagnosisWizard companyId={companyId} questions={questions} />
    </div>
  );
}
