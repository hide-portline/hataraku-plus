-- auth.users に存在するが public.users にレコードがないユーザーをバックフィル
-- トリガー導入前に登録したアカウント向け
INSERT INTO public.users (id, name, email)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) AS name,
  email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
