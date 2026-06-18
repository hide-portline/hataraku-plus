# HATARAKU+ 開発手順

## 1. 環境準備

1. リポジトリをクローン
2. ルートで依存関係をインストール

```bash
npm install
```

3. `.env.local` を確認

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Supabase プロジェクトが必要な場合は、既存プロジェクトの環境変数を使用してください。

## 2. ローカル開発サーバー起動

```bash
npm run dev
```

`http://localhost:3000` を開いて確認します。

## 3. Supabase DB 初期化（診断フロー検証用）

### 3-1. `setup_all.sql` の実行

Supabase SQL Editor で `supabase/setup_all.sql` を実行し、テーブル定義とシードデータを作成します。

### 3-2. `calculate_matching_score` の確認

以下のコマンド例で接続できる場合は、`supabase/tests/test_matching.sql` を実行して `calculate_matching_score` を確認します。

```bash
psql "<YOUR_DATABASE_URL>" -f supabase/tests/test_matching.sql
```

結果として `matching_score` が 0〜100 の整数で返れば OK です。

### 3-3. RLS と企業診断の確認

- `company_diagnosis_messages` ではなく `company_diagnosis_results` の読み取りと書き込みが `company_members` に限定されています。
- 企業管理者ログインは `http://localhost:3000/company/login` です。
- 企業側の診断ページは `http://localhost:3000/company/diagnosis` で、`company_members` に所属するユーザーのみアクセスできます。

## 4. 価値観診断フローの確認

1. `http://localhost:3000/diagnosis` にログイン後アクセス
2. 20問の診断を完了
3. `http://localhost:3000/diagnosis/result` で結果表示を確認
4. マイページ（`/mypage`）に診断結果が表示されるか確認

## 5. 管理者アカウント

Supabase Auth で管理者アカウントを作成し、必要であれば `companies` / `users` 等を手動設定します。

- 管理画面は `http://localhost:3000/admin` です。
- `ADMIN_EMAILS` に管理者メールアドレスをカンマ区切りで設定すると、管理画面へのアクセスがそのメールアドレスに限定されます。

---

## 6. 追加調査：求人一覧の改善

求人一覧は `app/(public)/jobs/page.tsx` と `components/job/JobCard.tsx` で表示されます。
`JobCard` のカードが中心なので、視認性の高いバッジ・企業情報・職種の強調を追加すると効果的です。
