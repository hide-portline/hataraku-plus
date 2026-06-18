-- ============================================================
-- HATARAKU+ デモデータ
-- Supabase SQL Editor で実行してください
-- ============================================================

-- ── 1. Auth ユーザー10名 ────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  aud, role,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
  ('a0000001-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','tanaka@demo.jp', crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"田中 太郎"}','authenticated','authenticated','','','',''),
  ('a0000002-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','suzuki@demo.jp', crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"鈴木 花子"}','authenticated','authenticated','','','',''),
  ('a0000003-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','yamada@demo.jp', crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"山田 健太"}','authenticated','authenticated','','','',''),
  ('a0000004-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','ito@demo.jp',    crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"伊藤 美咲"}','authenticated','authenticated','','','',''),
  ('a0000005-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','watanabe@demo.jp',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"渡辺 翔"}', 'authenticated','authenticated','','','',''),
  ('a0000006-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','nakamura@demo.jp',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"中村 愛"}', 'authenticated','authenticated','','','',''),
  ('a0000007-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','kobayashi@demo.jp',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'{"provider":"email","providers":["email"]}','{"name":"小林 大輔"}','authenticated','authenticated','','','',''),
  ('a0000008-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','kato@demo.jp',   crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"加藤 さくら"}','authenticated','authenticated','','','',''),
  ('a0000009-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','yoshida@demo.jp',crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"吉田 拓海"}','authenticated','authenticated','','','',''),
  ('a0000010-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','sato@demo.jp',   crypt('Demo1234!',gen_salt('bf')), now(),now(),now(), '{"provider":"email","providers":["email"]}','{"name":"佐藤 由紀"}','authenticated','authenticated','','','','')
ON CONFLICT (id) DO NOTHING;

-- ── 2. users テーブル ───────────────────────────────────────
INSERT INTO users (id, name, email, bio, desired_location, employment_type_pref) VALUES
  ('a0000001-0000-0000-0000-000000000000','田中 太郎',  'tanaka@demo.jp',   '淡路島出身。Uターンして地元で働きたいと考えています。', '淡路島', 'fulltime'),
  ('a0000002-0000-0000-0000-000000000000','鈴木 花子',  'suzuki@demo.jp',   '大阪で5年間マーケティングを担当。島暮らしに憧れています。', '淡路市', 'fulltime'),
  ('a0000003-0000-0000-0000-000000000000','山田 健太',  'yamada@demo.jp',   'ITエンジニア。リモートワークをしながら淡路島移住を検討中。', '洲本市', 'contract'),
  ('a0000004-0000-0000-0000-000000000000','伊藤 美咲',  'ito@demo.jp',      '観光業に興味あり。接客・ホスピタリティが得意です。', '南あわじ市', 'parttime'),
  ('a0000005-0000-0000-0000-000000000000','渡辺 翔',    'watanabe@demo.jp', '農業・食品系に転職希望。自然の中で働きたい。', '淡路島', 'fulltime'),
  ('a0000006-0000-0000-0000-000000000000','中村 愛',    'nakamura@demo.jp', 'デザイナー。クリエイティブな仕事をしながら移住したい。', '淡路島', 'fulltime'),
  ('a0000007-0000-0000-0000-000000000000','小林 大輔',  'kobayashi@demo.jp','建設・施工管理の経験5年。淡路島で腰を落ち着けたい。', '淡路市', 'fulltime'),
  ('a0000008-0000-0000-0000-000000000000','加藤 さくら','kato@demo.jp',     '飲食・フード業界出身。島の食材を使った仕事に興味。', '洲本市', 'parttime'),
  ('a0000009-0000-0000-0000-000000000000','吉田 拓海',  'yoshida@demo.jp',  '新卒。淡路島でスタートアップに挑戦したい。', '淡路島', 'fulltime'),
  ('a0000010-0000-0000-0000-000000000000','佐藤 由紀',  'sato@demo.jp',     '子育て中。週3〜4日、地元で無理なく働ける職場を探しています。', '南あわじ市', 'parttime')
ON CONFLICT (id) DO NOTHING;

-- ── 3. 企業10社 ─────────────────────────────────────────────
INSERT INTO companies (
  id, company_name, industry, description, vision,
  culture_description, employee_count, founded_year, location,
  website_url, contact_email, values_type, status, region_id
)
SELECT
  id, company_name, industry, description, vision,
  culture_description, employee_count, founded_year, location,
  website_url, contact_email, values_type, 'approved',
  (SELECT id FROM regions WHERE slug = 'awaji')
FROM (VALUES
  ('b0000001-0000-0000-0000-000000000000'::uuid,
   '淡路バーガー株式会社', '飲食・フード',
   '淡路島産の玉ねぎ・牛肉・野菜にこだわった本格バーガーを展開。島内3店舗、通販も好調。',
   '淡路島の食の魅力を日本中に届ける。地産地消で島の農家とともに成長する。',
   '少数精鋭、全員が主役。若手でもすぐ裁量をもって動ける環境です。',
   28, 2015, '淡路市岩屋', 'https://example.com', 'info@awaji-burger.example', 'challenger'),

  ('b0000002-0000-0000-0000-000000000000'::uuid,
   '株式会社あわじファーム', '農業・食品',
   '淡路島を代表する玉ねぎ・レタス農場。6次産業化にも積極的に取り組んでいます。',
   '農業を通じて島の経済を支え、次世代の農家を育てる。',
   '自然のサイクルに合わせたゆっくりとした働き方。チームワークを大切にしています。',
   45, 2003, '淡路市', 'https://example.com', 'info@awaji-farm.example', 'stable'),

  ('b0000003-0000-0000-0000-000000000000'::uuid,
   '淡路島ウェルネス株式会社', 'ヘルスケア・wellness',
   '島の自然を活かしたウェルネスリトリートを運営。ヨガ・瞑想・食事プログラムを提供。',
   '島の自然と人の力で、訪れるすべての人の心と体を整える。',
   'スタッフ自身がウェルネスを体現できる職場づくり。休暇取得率90%以上。',
   18, 2019, '洲本市', 'https://example.com', 'info@awaji-wellness.example', 'team'),

  ('b0000004-0000-0000-0000-000000000000'::uuid,
   '株式会社マリンアクティビティ淡路', 'レジャー・観光',
   'SUP・シーカヤック・ダイビングなど海のアクティビティ全般を提供。年間3万人が利用。',
   '淡路島の海を世界レベルのフィールドに。',
   '海が好きなら誰でもウェルカム。経験よりも情熱を重視します。',
   22, 2017, '南あわじ市福良', 'https://example.com', 'info@marine-awaji.example', 'challenger'),

  ('b0000005-0000-0000-0000-000000000000'::uuid,
   '淡路島リゾートホテル&スパ', 'ホテル・宿泊',
   '海を望む全室オーシャンビューの高級リゾートホテル。レストラン・スパを併設。',
   '淡路島を代表するラグジュアリーな滞在体験を提供する。',
   '「おもてなし」を極める職場。研修制度が充実しており成長できます。',
   85, 2010, '淡路市', 'https://example.com', 'info@awaji-resort.example', 'team'),

  ('b0000006-0000-0000-0000-000000000000'::uuid,
   'あわじテクノロジー株式会社', 'IT・テクノロジー',
   '淡路島を拠点に農業・観光・行政のDXを推進するITスタートアップ。',
   'テクノロジーで淡路島の課題を解決し、地方DXのモデルケースを作る。',
   'リモートワーク可。エンジニアが主役の開発文化。',
   12, 2021, '洲本市', 'https://example.com', 'info@awaji-tech.example', 'challenger'),

  ('b0000007-0000-0000-0000-000000000000'::uuid,
   '淡路島水産株式会社', '水産・漁業',
   '淡路島近海の鯛・わかめ・牡蠣を中心とした水産加工・販売会社。鮮度へのこだわりが強み。',
   '島の海の恵みを次世代に継承し、豊かな漁業を守り続ける。',
   '職人気質の文化。技術を大切にし、長く働ける環境を整えています。',
   35, 1987, '南あわじ市', 'https://example.com', 'info@awaji-suisan.example', 'specialist'),

  ('b0000008-0000-0000-0000-000000000000'::uuid,
   '株式会社AWAJIクリエイティブ', 'クリエイティブ・デザイン',
   '島内外の企業のブランディング・Web制作・映像制作を手がけるクリエイティブ会社。',
   '淡路島から世界に通用するクリエイティブを発信する。',
   'クリエイターが自分らしく働ける環境。副業・兼業も歓迎。',
   9, 2018, '洲本市', 'https://example.com', 'info@awaji-creative.example', 'specialist'),

  ('b0000009-0000-0000-0000-000000000000'::uuid,
   '淡路島観光開発株式会社', '観光・まちづくり',
   '淡路島全体の観光振興・イベント企画・インバウンド誘致に取り組む官民連携企業。',
   '淡路島を日本を代表する観光地にする。',
   '地域と深く関わる仕事。自分のアイデアが島の未来に直結します。',
   30, 2012, '淡路市', 'https://example.com', 'info@awaji-kanko.example', 'team'),

  ('b0000010-0000-0000-0000-000000000000'::uuid,
   '島の食品工房 株式会社', '食品製造・加工',
   '淡路島産素材を使ったジャム・ドレッシング・加工食品の製造販売。全国百貨店に出品。',
   '島の素材の価値を最大化し、ものづくりの喜びを届ける。',
   'ものづくりへのこだわりを持つ仲間が集まる職場。品質第一の文化。',
   20, 2008, '南あわじ市', 'https://example.com', 'info@shima-foods.example', 'specialist')
) AS t(id, company_name, industry, description, vision, culture_description, employee_count, founded_year, location, website_url, contact_email, values_type)
ON CONFLICT (id) DO NOTHING;

-- ── 4. 求人 (各社1〜2件) ────────────────────────────────────
INSERT INTO jobs (
  id, company_id, title, employment_type, salary_min, salary_max,
  location, description, work_style, values_type, is_published, published_at, region_id
)
SELECT
  id, company_id, title, employment_type::text::employment_type,
  salary_min, salary_max, location, description,
  work_style::text::work_style, values_type::text::values_type,
  true, now(),
  (SELECT id FROM regions WHERE slug = 'awaji')
FROM (VALUES
  ('c0000001-0000-0000-0000-000000000000'::uuid, 'b0000001-0000-0000-0000-000000000000'::uuid,
   '店舗スタッフ・キッチンリーダー候補', 'fulltime', 220, 300,
   '淡路市岩屋', '淡路島産素材へのこだわりを共有できる方。調理経験不問。まず食べてみてください。',
   'onsite', 'challenger'),

  ('c0000002-0000-0000-0000-000000000000'::uuid, 'b0000002-0000-0000-0000-000000000000'::uuid,
   '農業スタッフ（正社員・未経験歓迎）', 'fulltime', 200, 270,
   '淡路市', '農業未経験大歓迎。先輩スタッフが丁寧に指導します。収穫の喜びを一緒に感じましょう。',
   'onsite', 'stable'),

  ('c0000003-0000-0000-0000-000000000000'::uuid, 'b0000003-0000-0000-0000-000000000000'::uuid,
   'ウェルネスプログラム担当', 'fulltime', 240, 320,
   '洲本市', 'ヨガ・瞑想・食事指導いずれかの資格保有者歓迎。自分自身もウェルネスを実践したい方。',
   'onsite', 'team'),

  ('c0000004-0000-0000-0000-000000000000'::uuid, 'b0000004-0000-0000-0000-000000000000'::uuid,
   'マリンアクティビティインストラクター', 'fulltime', 230, 290,
   '南あわじ市', 'SUP・カヤック経験者歓迎。未経験でも海が好きなら歓迎。ライセンス取得支援あり。',
   'onsite', 'challenger'),

  ('c0000005-0000-0000-0000-000000000000'::uuid, 'b0000005-0000-0000-0000-000000000000'::uuid,
   'フロントスタッフ（ホテル）', 'fulltime', 230, 310,
   '淡路市', 'お客様に最高の体験を届けたい方。語学力（英語・中国語）があれば尚可。',
   'onsite', 'team'),

  ('c0000006-0000-0000-0000-000000000000'::uuid, 'b0000006-0000-0000-0000-000000000000'::uuid,
   'フルスタックエンジニア', 'fulltime', 400, 600,
   '洲本市（リモート可）', 'Next.js / TypeScript / Supabase 経験者優遇。地方から世界を変えるプロダクトを作りたい方。',
   'remote', 'challenger'),

  ('c0000007-0000-0000-0000-000000000000'::uuid, 'b0000007-0000-0000-0000-000000000000'::uuid,
   '水産加工スタッフ', 'fulltime', 200, 260,
   '南あわじ市', '魚介の加工・品質管理業務。食品衛生の知識がある方歓迎。丁寧に教えます。',
   'onsite', 'specialist'),

  ('c0000008-0000-0000-0000-000000000000'::uuid, 'b0000008-0000-0000-0000-000000000000'::uuid,
   'Webデザイナー・ディレクター', 'fulltime', 300, 450,
   '洲本市（リモート可）', 'Figma / Adobe 使える方。UI/UXへの強いこだわりをお持ちの方と一緒に働きたいです。',
   'hybrid', 'specialist'),

  ('c0000009-0000-0000-0000-000000000000'::uuid, 'b0000009-0000-0000-0000-000000000000'::uuid,
   '観光企画・プロモーション担当', 'fulltime', 250, 340,
   '淡路市', 'SNS・インバウンド施策の企画立案から実行まで担当。島の魅力を発信したい方。',
   'onsite', 'team'),

  ('c0000010-0000-0000-0000-000000000000'::uuid, 'b0000010-0000-0000-0000-000000000000'::uuid,
   '食品製造スタッフ・品質管理', 'fulltime', 210, 270,
   '南あわじ市', '丁寧なものづくりができる方。食品製造・品質管理の経験者優遇。未経験も応募可。',
   'onsite', 'specialist')
) AS t(id, company_id, title, employment_type, salary_min, salary_max, location, description, work_style, values_type)
ON CONFLICT (id) DO NOTHING;
