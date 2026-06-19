import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hataraku-plus.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
    template: "%s | Hataraku+淡路島",
  },
  description:
    "条件だけでなく価値観で企業と出会う。淡路島の企業文化・価値観・働く人の魅力を可視化した地域特化型採用プラットフォーム。",
  keywords: ["淡路島", "求人", "採用", "価値観", "企業文化", "移住", "UIターン", "転職"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Hataraku+淡路島",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
    description: "条件だけでなく価値観で企業と出会う。淡路島特化の採用プラットフォーム。",
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
