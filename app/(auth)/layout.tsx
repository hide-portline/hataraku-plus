import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* 左：ブランドパネル */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-text-primary)] flex-col justify-between p-16">
        <Link href="/" className="text-white font-extrabold text-2xl tracking-tight">
          Hataraku+
        </Link>
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/40 mb-8">
            Awaji Island · Values-Based Recruitment
          </p>
          <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-white mb-8">
            条件ではなく、<br />
            <span className="text-[var(--color-accent)]">価値観</span>で<br />
            仕事を選ぶ。
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-sm">
            企業文化・ビジョン・働く人の魅力を可視化。淡路島で、自分らしいキャリアと出会う。
          </p>
        </div>
        <div className="flex gap-12">
          {[
            { value: "無料", label: "診断・登録" },
            { value: "4種", label: "価値観タイプ" },
            { value: "3分", label: "診断所要時間" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 右：フォーム */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 bg-[var(--color-surface)]">
        <div className="w-full max-w-sm">
          {/* モバイルのみロゴ表示 */}
          <Link href="/" className="lg:hidden block text-center text-xl font-extrabold text-[var(--color-brand)] mb-10">
            Hataraku+
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
