import type { Metadata } from "next";
import CompanyLoginForm from "./CompanyLoginForm";

export const metadata: Metadata = {
  title: "企業ログイン",
  description: "Hataraku+淡路島の企業様向けログインページ。ダッシュボードで求人管理・応募者管理ができます。",
  robots: { index: false, follow: false },
};

export default function CompanyLoginPage() {
  return <CompanyLoginForm />;
}
