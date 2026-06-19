export const metadata = { title: "プライバシーポリシー | HATARAKU+淡路島" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">最終更新日：2026年6月19日</p>

      <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] space-y-8">

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">1. 事業者情報</h2>
          <p>
            HATARAKU+淡路島（以下「当サービス」）は、淡路島で働くことを希望する求職者と
            淡路島内の企業とのマッチングを目的としたプラットフォームです。
          </p>
          <p className="mt-2 text-[var(--color-text-muted)]">
            運営者：HATARAKU+淡路島<br />
            お問い合わせ：サイト内お問い合わせフォームよりご連絡ください
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">2. 取得する個人情報</h2>
          <p>当サービスでは、以下の情報を取得します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>氏名、メールアドレス、パスワード（ハッシュ化）</li>
            <li>プロフィール情報（自己紹介、希望勤務地、希望雇用形態など）</li>
            <li>価値観診断の回答・結果</li>
            <li>企業への応募内容・メッセージ</li>
            <li>アクセスログ（IPアドレス、ブラウザ種別、閲覧ページなど）</li>
            <li>企業情報（会社名、業種、所在地、担当者名など）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">3. 利用目的</h2>
          <p>取得した個人情報は、以下の目的で利用します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>アカウントの作成・管理・認証</li>
            <li>求職者と企業のマッチング提供</li>
            <li>応募・スカウト機能の提供</li>
            <li>価値観診断結果の算出・表示</li>
            <li>サービスに関するお知らせ・メール送信</li>
            <li>不正利用の防止・セキュリティの維持</li>
            <li>サービスの改善・新機能の開発</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">4. 第三者への提供</h2>
          <p>
            当サービスは、以下の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
            <li>公衆衛生の向上・児童の健全育成のために必要な場合</li>
            <li>国の機関・地方公共団体の法令業務への協力が必要な場合</li>
          </ul>
          <p className="mt-3">
            なお、求職者が企業へ応募した場合、応募に必要な情報（氏名・メッセージ等）を
            当該企業に提供します。これは本サービスの本来機能であり、利用規約への同意をもって
            ご承諾いただいたものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">5. 外部サービスの利用</h2>
          <p>当サービスは、以下の外部サービスを利用しています。各サービスのプライバシーポリシーをご確認ください。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase（データベース・認証）：PostgreSQLデータの管理に利用</li>
            <li>Vercel（ホスティング）：Webサービスの配信に利用</li>
            <li>Resend（メール送信）：通知メールの送信に利用</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">6. Cookie・ログ情報</h2>
          <p>
            当サービスは、認証状態の維持のためにCookieを使用します。
            Cookieはブラウザの設定で無効にできますが、その場合一部の機能が
            利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">7. 個人情報の管理・安全対策</h2>
          <p>
            当サービスは、個人情報の漏洩・滅失・毀損を防止するため、適切な安全管理措置を講じます。
            パスワードは暗号化して保存し、通信はSSL/TLSで保護されています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">8. 個人情報の開示・訂正・削除</h2>
          <p>
            ご本人から個人情報の開示・訂正・削除の請求があった場合、
            ご本人確認の上で対応いたします。
            マイページからプロフィール情報の変更・削除が可能です。
            アカウント削除については、お問い合わせください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">9. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーは、法令の改正やサービス内容の変更に伴い、
            予告なく改定される場合があります。
            重要な変更がある場合はサービス内でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">10. お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、
            サービス内のお問い合わせフォームよりご連絡ください。
          </p>
        </section>

      </div>
    </div>
  );
}
