import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Hataraku+淡路島について | About" };

export default function AboutPage() {
  return (
    <>
      {/* ヒーロー */}
      <section className="min-h-[80vh] flex flex-col justify-between border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-10 flex-1 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-10">
                About · Hataraku+ Awaji Island
              </p>
              <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-text-primary)]">
                「どこで<br />
                働くか」より<br />
                「<span className="text-[var(--color-accent)]">どう生きるか</span>」<br />
                から始める。
              </h1>
            </div>
            <div className="md:max-w-xs pb-2">
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
                Hataraku+は、条件ではなく価値観で仕事を選ぶ文化をつくる、淡路島特化の採用プラットフォームです。
              </p>
              <Link
                href="/diagnosis"
                className="group inline-flex items-center justify-between px-6 py-4 rounded-xl bg-[var(--color-text-primary)] text-white text-sm font-semibold hover:bg-[var(--color-accent)] transition-colors duration-300"
              >
                価値観診断をはじめる
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* キーワード */}
        <div className="max-w-7xl mx-auto w-full px-6 pb-12">
          <div className="flex gap-12 md:gap-20">
            {[
              { value: "2025", label: "サービス開始" },
              { value: "淡路島", label: "特化エリア" },
              { value: "4種", label: "価値観タイプ" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* マーキー */}
      <div className="overflow-hidden border-b border-[var(--color-border)] py-4 bg-[var(--color-surface)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-sm font-semibold text-[var(--color-text-muted)] tracking-widest uppercase">
              {["Awaji Island", "価値観マッチング", "UIターン就職", "島で働く", "Values Matching", "Working Culture", "自分らしい働き方", "淡路島に来て"].map((t) => (
                <span key={t} className="flex items-center gap-8">
                  {t}
                  <span className="text-[var(--color-accent)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ミッション */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)]">Our Mission</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] md:max-w-sm leading-tight">
            なぜ、淡路島なのか。
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {reasons.map((r) => (
            <div key={r.title}>
              {/* 写真 */}
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-[var(--color-surface)]">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* 丸矢印 + タイトル */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand)] text-white shrink-0">
                  <ArrowRight size={14} />
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{r.title}</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 価値観マッチングとは */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-8">
                Values Matching
              </p>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] mb-8">
                給与より、<br />
                <span className="text-[var(--color-accent)]">価値観</span>が<br />
                長続きする。
              </h2>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                「稼げる」より「やりがいがある」仕事を選びたい。そんな想いを持つ人が増えています。
                Hataraku+は、求職者と企業それぞれの「大切にしていること」を診断で可視化し、
                価値観のマッチ度をスコアで表示します。
              </p>
            </div>
            <div className="space-y-px border border-[var(--color-border)]">
              {valueTypes.map((v) => (
                <div key={v.type} className="flex items-start gap-6 p-6 bg-white border-b border-[var(--color-border)] last:border-0">
                  <span className="text-2xl shrink-0">{v.icon}</span>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] mb-1">{v.type}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 運営情報 */}
      <section className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-3">Operator</p>
            <p className="text-xl font-bold text-[var(--color-text-primary)]">Hataraku+淡路島 運営事務局</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              お問い合わせ：
              <a href="mailto:hello@hataraku-plus.jp" className="text-[var(--color-accent)] hover:underline">
                hello@hataraku-plus.jp
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              プライバシーポリシー
            </Link>
            <span className="text-[var(--color-border)]">|</span>
            <Link href="/terms" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              利用規約
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-text-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-6">Free · 3 minutes</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              あなたの価値観を<br />知るところから。
            </h2>
          </div>
          <Link
            href="/diagnosis"
            className="group shrink-0 inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            価値観診断をはじめる（無料）
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}

const reasons = [
  {
    title: "多様な産業が共存する島",
    description: "農業・漁業・IT・観光・食品加工。都市では出会えない多様な仕事が、淡路島という小さな島に凝縮されています。",
    image: "https://picsum.photos/seed/awaji-farm/800/600",
  },
  {
    title: "自然と都市、両方ある暮らし",
    description: "神戸・大阪へのアクセスを保ちながら、海と山に囲まれた環境で暮らせる。「田舎すぎない田舎」がここにあります。",
    image: "https://picsum.photos/seed/awaji-sea/800/600",
  },
  {
    title: "移住者を受け入れる文化",
    description: "淡路島は移住者の受け入れに積極的。UIターン就職にも対応した企業が多く、新しい生活をスムーズにスタートできます。",
    image: "https://picsum.photos/seed/awaji-town/800/600",
  },
];

const valueTypes = [
  { icon: "🔥", type: "Challenger型", description: "挑戦・成長・変化を求める。新しいことに飛び込むエネルギーを持つ人。" },
  { icon: "🌿", type: "Stable型", description: "安定・継続・信頼を大切にする。地道にコツコツと積み上げる力がある人。" },
  { icon: "🤝", type: "Team型", description: "協調・共感・チームワークを重視する。人との繋がりに喜びを感じる人。" },
  { icon: "🔬", type: "Specialist型", description: "専門性・探求・独自性を追求する。深く掘り下げることに情熱を持つ人。" },
];
