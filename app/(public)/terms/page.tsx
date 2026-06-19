export const metadata = { title: "利用規約 | Hataraku+淡路島" };

export default function TermsPage() {
  return (
    <div>
      {/* ヘッダー */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-6">
            Terms of Service
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-tight text-[var(--color-text-primary)]">
            利用規約
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-6">最終更新日：2026年6月19日</p>
        </div>
      </div>

    <div className="max-w-3xl mx-auto px-4 py-16">

      <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] space-y-8">

        <p>
          本利用規約（以下「本規約」）は、Hataraku+淡路島（以下「当サービス」）が提供する
          求人・採用マッチングプラットフォームの利用に関する条件を定めるものです。
          ご利用の前に必ずお読みください。
        </p>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第1条（定義）</h2>
          <p>本規約において、以下の用語は次の意味で使用します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>「ユーザー」：当サービスに登録した求職者</li>
            <li>「企業」：当サービスに登録した法人・個人事業主</li>
            <li>「会員」：ユーザーおよび企業の総称</li>
            <li>「コンテンツ」：当サービス上の文章・画像・動画・求人情報等</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第2条（登録・アカウント）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>当サービスへの登録は、18歳以上の方を対象とします。</li>
            <li>登録情報は正確かつ最新の情報を入力してください。</li>
            <li>1人（1社）につき1アカウントのみ登録できます。</li>
            <li>アカウントの譲渡・貸し出しは禁止します。</li>
            <li>企業アカウントは、運営による審査後に利用可能となります。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第3条（サービスの内容）</h2>
          <p>当サービスは以下の機能を提供します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>求人情報の掲載・閲覧</li>
            <li>企業情報の掲載・閲覧</li>
            <li>価値観診断とマッチングスコア表示</li>
            <li>求職者から企業への応募機能</li>
            <li>企業からのストーリー記事掲載</li>
          </ul>
          <p className="mt-3">
            当サービスはマッチングの場を提供するものであり、雇用の成立を保証するものではありません。
            採用・不採用の判断は企業が行います。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第4条（禁止事項）</h2>
          <p>会員は以下の行為を行ってはなりません。</p>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            <li>虚偽の情報を登録・掲載する行為</li>
            <li>他者のアカウントを無断で使用する行為</li>
            <li>当サービスのシステムに不正にアクセスする行為</li>
            <li>スパム・迷惑メッセージの送信</li>
            <li>求人・採用目的以外での個人情報の収集・利用</li>
            <li>当サービスを通じた詐欺・ねずみ講・マルチ商法等への勧誘</li>
            <li>公序良俗に反する行為</li>
            <li>法令に違反する行為</li>
            <li>その他、運営が不適切と判断する行為</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第5条（企業の責任）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>企業は、掲載する求人情報が正確であることを保証してください。</li>
            <li>応募者の個人情報は、採用活動の目的にのみ使用し、適切に管理してください。</li>
            <li>不採用の場合は、速やかにその旨を応募者に連絡してください。</li>
            <li>労働関係法令を遵守した採用活動を行ってください。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第6条（知的財産権）</h2>
          <p>
            当サービス上のコンテンツ（デザイン・ロゴ・テキスト等）の著作権は
            当サービスまたは正当な権利者に帰属します。
            会員が投稿したコンテンツの著作権は会員に帰属しますが、
            当サービスはサービス改善・プロモーション等の目的で
            無償で利用できるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第7条（サービスの変更・停止）</h2>
          <p>
            当サービスは、事前の通知なくサービス内容の変更・追加・停止を
            行うことがあります。これにより会員に損害が生じた場合でも、
            当サービスは責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第8条（免責事項）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>当サービスは、求職者と企業の間で生じた紛争について責任を負いません。</li>
            <li>掲載情報の正確性・完全性について保証しません。</li>
            <li>当サービスの利用により生じた損害について、当サービスの故意・重過失を除き責任を負いません。</li>
            <li>システムの障害・メンテナンスによる一時的な利用不可について責任を負いません。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第9条（退会・アカウント削除）</h2>
          <p>
            会員はいつでも退会できます。退会後はアカウント情報が削除されますが、
            応募履歴等の情報は法令に基づく保存期間が経過するまで保持される場合があります。
            退会後の情報復元はできません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第10条（規約の変更）</h2>
          <p>
            当サービスは、必要に応じて本規約を変更できるものとします。
            変更後に当サービスを利用した場合、変更後の規約に同意したものとみなします。
            重要な変更はサービス内でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">第11条（準拠法・管轄裁判所）</h2>
          <p>
            本規約は日本法に準拠します。
            当サービスと会員の間で生じた紛争については、
            神戸地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

      </div>
    </div>
    </div>
  );
}
