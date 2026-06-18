import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://krgucyylbhfpldvkcsec.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZ3VjeXlsYmhmcGxkdmtjc2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzQyNzQsImV4cCI6MjA5NzMxMDI3NH0.xLZG7q1T4550pnLZUdM5b_7WlZOhDRnic7wxAnTG0cY"
);

async function main() {
  // 地域ID取得
  const { data: regions } = await supabase.from("regions").select("id").eq("slug", "awaji").single();
  const regionId = regions?.id;
  if (!regionId) { console.error("地域IDが取得できません"); process.exit(1); }
  console.log("地域ID:", regionId);

  // 企業10社
  const companies = [
    { id: "b0000001-0000-0000-0000-000000000000", company_name: "淡路バーガー株式会社", industry: "飲食・フード", description: "淡路島産の玉ねぎ・牛肉・野菜にこだわった本格バーガーを展開。島内3店舗、通販も好調。", vision: "淡路島の食の魅力を日本中に届ける。地産地消で島の農家とともに成長する。", culture_description: "少数精鋭、全員が主役。若手でもすぐ裁量をもって動ける環境です。", employee_count: 28, founded_year: 2015, location: "淡路市岩屋", contact_email: "info@awaji-burger.example", values_type: "challenger", status: "approved", region_id: regionId },
    { id: "b0000002-0000-0000-0000-000000000000", company_name: "株式会社あわじファーム", industry: "農業・食品", description: "淡路島を代表する玉ねぎ・レタス農場。6次産業化にも積極的に取り組んでいます。", vision: "農業を通じて島の経済を支え、次世代の農家を育てる。", culture_description: "自然のサイクルに合わせたゆっくりとした働き方。チームワークを大切にしています。", employee_count: 45, founded_year: 2003, location: "淡路市", contact_email: "info@awaji-farm.example", values_type: "stable", status: "approved", region_id: regionId },
    { id: "b0000003-0000-0000-0000-000000000000", company_name: "淡路島ウェルネス株式会社", industry: "ヘルスケア・wellness", description: "島の自然を活かしたウェルネスリトリートを運営。ヨガ・瞑想・食事プログラムを提供。", vision: "島の自然と人の力で、訪れるすべての人の心と体を整える。", culture_description: "スタッフ自身がウェルネスを体現できる職場づくり。休暇取得率90%以上。", employee_count: 18, founded_year: 2019, location: "洲本市", contact_email: "info@awaji-wellness.example", values_type: "team", status: "approved", region_id: regionId },
    { id: "b0000004-0000-0000-0000-000000000000", company_name: "株式会社マリンアクティビティ淡路", industry: "レジャー・観光", description: "SUP・シーカヤック・ダイビングなど海のアクティビティ全般を提供。年間3万人が利用。", vision: "淡路島の海を世界レベルのフィールドに。", culture_description: "海が好きなら誰でもウェルカム。経験よりも情熱を重視します。", employee_count: 22, founded_year: 2017, location: "南あわじ市福良", contact_email: "info@marine-awaji.example", values_type: "challenger", status: "approved", region_id: regionId },
    { id: "b0000005-0000-0000-0000-000000000000", company_name: "淡路島リゾートホテル&スパ", industry: "ホテル・宿泊", description: "海を望む全室オーシャンビューの高級リゾートホテル。レストラン・スパを併設。", vision: "淡路島を代表するラグジュアリーな滞在体験を提供する。", culture_description: "「おもてなし」を極める職場。研修制度が充実しており成長できます。", employee_count: 85, founded_year: 2010, location: "淡路市", contact_email: "info@awaji-resort.example", values_type: "team", status: "approved", region_id: regionId },
    { id: "b0000006-0000-0000-0000-000000000000", company_name: "あわじテクノロジー株式会社", industry: "IT・テクノロジー", description: "淡路島を拠点に農業・観光・行政のDXを推進するITスタートアップ。", vision: "テクノロジーで淡路島の課題を解決し、地方DXのモデルケースを作る。", culture_description: "リモートワーク可。エンジニアが主役の開発文化。", employee_count: 12, founded_year: 2021, location: "洲本市", contact_email: "info@awaji-tech.example", values_type: "challenger", status: "approved", region_id: regionId },
    { id: "b0000007-0000-0000-0000-000000000000", company_name: "淡路島水産株式会社", industry: "水産・漁業", description: "淡路島近海の鯛・わかめ・牡蠣を中心とした水産加工・販売会社。鮮度へのこだわりが強み。", vision: "島の海の恵みを次世代に継承し、豊かな漁業を守り続ける。", culture_description: "職人気質の文化。技術を大切にし、長く働ける環境を整えています。", employee_count: 35, founded_year: 1987, location: "南あわじ市", contact_email: "info@awaji-suisan.example", values_type: "specialist", status: "approved", region_id: regionId },
    { id: "b0000008-0000-0000-0000-000000000000", company_name: "株式会社AWAJIクリエイティブ", industry: "クリエイティブ・デザイン", description: "島内外の企業のブランディング・Web制作・映像制作を手がけるクリエイティブ会社。", vision: "淡路島から世界に通用するクリエイティブを発信する。", culture_description: "クリエイターが自分らしく働ける環境。副業・兼業も歓迎。", employee_count: 9, founded_year: 2018, location: "洲本市", contact_email: "info@awaji-creative.example", values_type: "specialist", status: "approved", region_id: regionId },
    { id: "b0000009-0000-0000-0000-000000000000", company_name: "淡路島観光開発株式会社", industry: "観光・まちづくり", description: "淡路島全体の観光振興・イベント企画・インバウンド誘致に取り組む官民連携企業。", vision: "淡路島を日本を代表する観光地にする。", culture_description: "地域と深く関わる仕事。自分のアイデアが島の未来に直結します。", employee_count: 30, founded_year: 2012, location: "淡路市", contact_email: "info@awaji-kanko.example", values_type: "team", status: "approved", region_id: regionId },
    { id: "b0000010-0000-0000-0000-000000000000", company_name: "島の食品工房 株式会社", industry: "食品製造・加工", description: "淡路島産素材を使ったジャム・ドレッシング・加工食品の製造販売。全国百貨店に出品。", vision: "島の素材の価値を最大化し、ものづくりの喜びを届ける。", culture_description: "ものづくりへのこだわりを持つ仲間が集まる職場。品質第一の文化。", employee_count: 20, founded_year: 2008, location: "南あわじ市", contact_email: "info@shima-foods.example", values_type: "specialist", status: "approved", region_id: regionId },
  ];

  const { error: companyError } = await supabase.from("companies").upsert(companies);
  if (companyError) console.error("企業エラー:", companyError.message);
  else console.log("✓ 企業10社 挿入完了");

  // 求人10件
  const jobs = [
    { id: "c0000001-0000-0000-0000-000000000000", company_id: "b0000001-0000-0000-0000-000000000000", title: "店舗スタッフ・キッチンリーダー候補", employment_type: "fulltime", salary_min: 220, salary_max: 300, location: "淡路市岩屋", description: "淡路島産素材へのこだわりを共有できる方。調理経験不問。", work_style: "onsite", values_type: "challenger", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000002-0000-0000-0000-000000000000", company_id: "b0000002-0000-0000-0000-000000000000", title: "農業スタッフ（正社員・未経験歓迎）", employment_type: "fulltime", salary_min: 200, salary_max: 270, location: "淡路市", description: "農業未経験大歓迎。先輩スタッフが丁寧に指導します。", work_style: "onsite", values_type: "stable", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000003-0000-0000-0000-000000000000", company_id: "b0000003-0000-0000-0000-000000000000", title: "ウェルネスプログラム担当", employment_type: "fulltime", salary_min: 240, salary_max: 320, location: "洲本市", description: "ヨガ・瞑想・食事指導いずれかの資格保有者歓迎。", work_style: "onsite", values_type: "team", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000004-0000-0000-0000-000000000000", company_id: "b0000004-0000-0000-0000-000000000000", title: "マリンアクティビティインストラクター", employment_type: "fulltime", salary_min: 230, salary_max: 290, location: "南あわじ市", description: "SUP・カヤック経験者歓迎。ライセンス取得支援あり。", work_style: "onsite", values_type: "challenger", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000005-0000-0000-0000-000000000000", company_id: "b0000005-0000-0000-0000-000000000000", title: "フロントスタッフ（ホテル）", employment_type: "fulltime", salary_min: 230, salary_max: 310, location: "淡路市", description: "お客様に最高の体験を届けたい方。語学力（英語・中国語）があれば尚可。", work_style: "onsite", values_type: "team", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000006-0000-0000-0000-000000000000", company_id: "b0000006-0000-0000-0000-000000000000", title: "フルスタックエンジニア", employment_type: "fulltime", salary_min: 400, salary_max: 600, location: "洲本市（リモート可）", description: "Next.js / TypeScript / Supabase 経験者優遇。地方から世界を変えるプロダクトを作りたい方。", work_style: "remote", values_type: "challenger", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000007-0000-0000-0000-000000000000", company_id: "b0000007-0000-0000-0000-000000000000", title: "水産加工スタッフ", employment_type: "fulltime", salary_min: 200, salary_max: 260, location: "南あわじ市", description: "魚介の加工・品質管理業務。食品衛生の知識がある方歓迎。", work_style: "onsite", values_type: "specialist", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000008-0000-0000-0000-000000000000", company_id: "b0000008-0000-0000-0000-000000000000", title: "Webデザイナー・ディレクター", employment_type: "fulltime", salary_min: 300, salary_max: 450, location: "洲本市（リモート可）", description: "Figma / Adobe 使える方。UI/UXへの強いこだわりをお持ちの方歓迎。", work_style: "hybrid", values_type: "specialist", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000009-0000-0000-0000-000000000000", company_id: "b0000009-0000-0000-0000-000000000000", title: "観光企画・プロモーション担当", employment_type: "fulltime", salary_min: 250, salary_max: 340, location: "淡路市", description: "SNS・インバウンド施策の企画立案から実行まで担当。", work_style: "onsite", values_type: "team", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
    { id: "c0000010-0000-0000-0000-000000000000", company_id: "b0000010-0000-0000-0000-000000000000", title: "食品製造スタッフ・品質管理", employment_type: "fulltime", salary_min: 210, salary_max: 270, location: "南あわじ市", description: "丁寧なものづくりができる方。食品製造・品質管理の経験者優遇。", work_style: "onsite", values_type: "specialist", is_published: true, published_at: new Date().toISOString(), region_id: regionId },
  ];

  const { error: jobError } = await supabase.from("jobs").upsert(jobs);
  if (jobError) console.error("求人エラー:", jobError.message);
  else console.log("✓ 求人10件 挿入完了");

  console.log("\n完了！ https://hataraku-plus.vercel.app/companies を確認してください");
}

main();
