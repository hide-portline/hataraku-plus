import Link from "next/link";
import Button from "@/components/ui/Button";

export default function TopPage() {
  return (
    <>
      {/* ヒーローセクション */}
      <section className="bg-[var(--color-brand)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="text-sm font-semibold text-[var(--color-accent)] mb-4 tracking-widest uppercase">
            淡路島で、価値観が合う会社と出会う
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            条件だけでなく、
            <br />
            <span className="text-[var(--color-accent)]">価値観</span>で企業と出会う。
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            企業文化・想い・働く人の魅力を可視化。診断を通じて、あなたらしい働き方を見つけてください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis">
              <Button variant="secondary" size="lg">
                価値観診断をはじめる
              </Button>
            </Link>
            <Link href="/companies">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[var(--color-brand)]"
              >
                企業を探す
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--color-text-primary)] mb-12">
          HATARAKU+淡路島 が選ばれる理由
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 価値観診断CTA */}
      <section className="bg-[var(--color-accent)] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            まずは価値観診断から
          </h2>
          <p className="text-white/80 mb-8">
            12の質問に答えるだけで、あなたのタイプと相性の良い企業がわかります。
          </p>
          <Link href="/diagnosis">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[var(--color-accent-dark)]"
            >
              無料で診断する（3分）
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    icon: "🧭",
    title: "価値観でマッチング",
    description: "給与・条件だけでなく、企業の文化・ビジョン・働く環境との相性を可視化します。",
  },
  {
    icon: "🏝️",
    title: "淡路島特化",
    description: "地域に根ざした企業の魅力を深くご紹介。移住・UIターン就職にも対応。",
  },
  {
    icon: "👥",
    title: "働く人の声",
    description: "企業インタビューや社員ストーリーを通じて、リアルな職場の雰囲気を伝えます。",
  },
];
