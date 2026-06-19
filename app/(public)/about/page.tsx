export const metadata = { title: "HATARAKU+淡路島について" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-widest mb-3">
          About
        </p>
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
          HATARAKU+淡路島とは
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto">
          「どこで働くか」ではなく「どう生きるか」から仕事を選ぶ。
          <br />
          価値観でつながる、淡路島の求人プラットフォームです。
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            なぜ淡路島なのか
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            淡路島は、自然豊かな環境と都市へのアクセスを両立した、
            日本でも稀有な島です。農業・漁業といった一次産業から、
            先進的なIT企業、観光・ホスピタリティまで、多様な産業が共存しています。
            移住者の受け入れにも積極的で、「田舎暮らし」の理想と
            「キャリアの充実」を同時に叶えられる場所として注目されています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            価値観マッチングとは
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            給与や待遇だけで仕事を選ぶ時代は終わりつつあります。
            HATARAKU+では、求職者と企業それぞれの「大切にしていること」を
            診断で可視化し、価値観のマッチ度をスコアで表示します。
            「自然と共生しながら働きたい」「チームで社会課題に挑みたい」
            「自分のペースでクリエイティブな仕事がしたい」——
            そんな想いを、同じ価値観を持つ企業と出会うことに活かします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            私たちのビジョン
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            淡路島で「自分らしく働く人」を増やすこと。
            それが私たちの目指すゴールです。
            求職者にとっては「ここで働いてよかった」と思える出会いを。
            企業にとっては「この人が来てくれてよかった」と思える採用を。
            そんな双方向の幸福を、テクノロジーで実現します。
          </p>
        </section>
      </div>

      <div className="mt-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)] mb-1">運営</p>
        <p className="font-bold text-[var(--color-text-primary)]">HATARAKU+淡路島 運営事務局</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          ご意見・お問い合わせは
          <a
            href="mailto:hello@hataraku-plus.jp"
            className="text-[var(--color-brand)] hover:underline ml-1"
          >
            hello@hataraku-plus.jp
          </a>
          までお気軽にどうぞ。
        </p>
      </div>
    </div>
  );
}
