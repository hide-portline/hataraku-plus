import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HATARAKU+淡路島 | 価値観で出会う採用プラットフォーム",
    template: "%s | HATARAKU+淡路島",
  },
  description:
    "条件だけでなく価値観で企業と出会う。淡路島の企業文化・価値観・働く人の魅力を可視化した地域特化型採用プラットフォーム。",
  keywords: ["淡路島", "求人", "採用", "価値観", "企業文化", "移住"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "HATARAKU+淡路島",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
