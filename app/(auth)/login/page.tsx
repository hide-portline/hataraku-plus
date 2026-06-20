import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ログイン",
  description: "Hataraku+淡路島にログインして、価値観マッチングで淡路島の企業を探しましょう。",
};

export default function LoginPage() {
  return <LoginForm />;
}
