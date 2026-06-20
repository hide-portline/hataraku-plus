import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "無料会員登録",
  description: "Hataraku+淡路島に無料登録して、価値観診断で自分に合う淡路島の企業を見つけましょう。",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
