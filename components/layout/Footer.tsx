import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand)] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold mb-2">HATARAKU+淡路島</p>
            <p className="text-sm text-white/70 leading-relaxed">
              条件だけでなく価値観で企業と出会う、淡路島特化の採用プラットフォーム。
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">求職者</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/register" className="hover:text-white transition-colors">会員登録</Link></li>
              <li><Link href="/diagnosis" className="hover:text-white transition-colors">価値観診断</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">求人を探す</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">企業を探す</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">企業の方</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/company/login" className="hover:text-white transition-colors">企業ログイン</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">記事・事例</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">その他</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-white transition-colors">このサービスについて</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} HATARAKU+淡路島 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
