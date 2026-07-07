-- Migration number: 0002 	 seed: 大阪市 50品目
-- このファイルは scripts/generate-seed.ts により seed/osaka-items.json から生成される。直接編集しないこと。

INSERT INTO municipalities (name, prefecture, bulky_waste_apply_url, source_url) VALUES ('大阪市', '大阪府', 'https://sodai.osaka-kankyojigyo.or.jp/', 'https://www.city.osaka.lg.jp/kankyo/page/0000369973.html');

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '靴', '靴', '普通ごみ', 0, '普通ごみの収集日に中身の見えるごみ袋に入れて出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'くつ', 'クツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '靴';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'スニーカー', 'スニーカー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '靴';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ブーツ', 'ブーツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '靴';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '革靴', '革靴'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '靴';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'サンダル', 'サンダル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '靴';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '傘', '傘', '普通ごみ', 0, '普通ごみへ。ごみ袋から突き出る場合は「ごみ」と表示して出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かさ', 'カサ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '傘';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ビニール傘', 'ビニール傘'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '傘';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '日傘', '日傘'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '傘';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '折りたたみ傘', '折リタタミ傘'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '傘';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ぬいぐるみ', 'ヌイグルミ', '普通ごみ', 0, '普通ごみの収集日に中身の見えるごみ袋に入れて出してください。30cmを超える大きなものは粗大ごみです。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '人形', '人形'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ぬいぐるみ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'にんぎょう', 'ニンギョウ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ぬいぐるみ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'クマのぬいぐるみ', 'クマノヌイグルミ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ぬいぐるみ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '乾電池', '乾電池', '普通ごみ', 0, '普通ごみとして出せますが、できるだけ区役所などの回収拠点をご利用ください。他のごみと分けて透明袋に入れて出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かんでんち', 'カンデンチ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '乾電池';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '電池', '電池'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '乾電池';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '単三電池', '単三電池'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '乾電池';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'アルカリ電池', 'アルカリ電池'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '乾電池';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '蛍光灯', '蛍光灯', '普通ごみ', 0, '紙などに包んで「キケン」と表示し、普通ごみへ。できるだけ購入店などの回収をご利用ください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'けいこうとう', 'ケイコウトウ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '蛍光灯';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '蛍光管', '蛍光管'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '蛍光灯';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '丸型蛍光灯', '丸型蛍光灯'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '蛍光灯';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '電球', '電球'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '蛍光灯';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'CD', 'cd', '普通ごみ', 0, 'ケースごと普通ごみへ出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'シーディー', 'シーディー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'CD';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'DVD', 'dvd'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'CD';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ブルーレイ', 'ブルーレイ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'CD';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ディスク', 'ディスク'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'CD';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ビデオテープ', 'ビデオテープ', '普通ごみ', 0, '普通ごみの収集日に中身の見えるごみ袋に入れて出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ビデオ', 'ビデオ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ビデオテープ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'VHS', 'vhs'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ビデオテープ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'カセットテープ', 'カセットテープ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ビデオテープ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ライター', 'ライター', '普通ごみ', 0, '必ず中身のガスを使い切ってから普通ごみへ出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'らいたー', 'ライター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ライター';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '使い捨てライター', '使イ捨テライター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ライター';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '100円ライター', '100円ライター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ライター';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '包丁', '包丁', '普通ごみ', 0, '刃先を紙などで包み「キケン」と表示して普通ごみへ出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ほうちょう', 'ホウチョウ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '包丁';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ナイフ', 'ナイフ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '包丁';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '刃物', '刃物'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '包丁';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '鏡', '鏡', '普通ごみ', 0, '割れないよう紙などに包み「キケン」と表示して普通ごみへ。最大の辺が30cmを超えるものは粗大ごみです。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かがみ', 'カガミ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鏡';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '手鏡', '手鏡'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鏡';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ミラー', 'ミラー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鏡';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '食器', '食器', '普通ごみ', 0, '陶器やガラスの食器は普通ごみへ。割れたものは紙に包み「キケン」と表示して出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'しょっき', 'ショッキ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食器';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '茶碗', '茶碗'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食器';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '皿', '皿'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食器';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'コップ', 'コップ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食器';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '陶器', '陶器'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食器';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '紙おむつ', '紙オムツ', '普通ごみ', 0, '汚物を取り除いてから普通ごみへ出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かみおむつ', 'カミオムツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙おむつ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'おむつ', 'オムツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙おむつ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'オムツ', 'オムツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙おむつ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'フライパン', 'フライパン', '普通ごみ', 0, '最大の辺が30cm以下のものは普通ごみへ。30cmを超えるものは粗大ごみです。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ふらいぱん', 'フライパン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'フライパン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'スキレット', 'スキレット'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'フライパン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '中華鍋', '中華鍋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'フライパン';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '鍋', '鍋', '普通ごみ', 0, '最大の辺が30cm以下のものは普通ごみへ。30cmを超えるものは粗大ごみです。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'なべ', 'ナベ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鍋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '片手鍋', '片手鍋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鍋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '両手鍋', '両手鍋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鍋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '圧力鍋', '圧力鍋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鍋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'やかん', 'ヤカン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '鍋';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'おもちゃ', 'オモチャ', '普通ごみ', 0, '電池を取り外してから普通ごみへ。最大の辺が30cmを超えるものは粗大ごみです。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'オモチャ', 'オモチャ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'おもちゃ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '玩具', '玩具'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'おもちゃ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'プラモデル', 'プラモデル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'おもちゃ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ミニカー', 'ミニカー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'おもちゃ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'かばん', 'カバン', '普通ごみ', 0, '普通ごみの収集日に中身の見えるごみ袋に入れて出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'カバン', 'カバン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'かばん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '鞄', '鞄'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'かばん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'バッグ', 'バッグ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'かばん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'リュック', 'リュック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'かばん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ハンドバッグ', 'ハンドバッグ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'かばん';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '自転車', '自転車', '粗大ごみ', 400, '粗大ごみ (事前申込制)。粗大ごみ処理手数料券400円を貼り、収集日に指定場所へ出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'じてんしゃ', 'ジテンシャ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '自転車';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'チャリ', 'チャリ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '自転車';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ママチャリ', 'ママチャリ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '自転車';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'チャリンコ', 'チャリンコ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '自転車';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'サイクル', 'サイクル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '自転車';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '電子レンジ', '電子レンジ', '粗大ごみ', 400, '粗大ごみ (事前申込制)。粗大ごみ処理手数料券400円を貼り、収集日に指定場所へ出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'でんしれんじ', 'デンシレンジ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '電子レンジ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'レンジ', 'レンジ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '電子レンジ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'オーブンレンジ', 'オーブンレンジ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '電子レンジ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '布団', '布団', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。折りたたんでひもで束ねて出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ふとん', 'フトン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '布団';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '掛け布団', '掛ケ布団'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '布団';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '敷布団', '敷布団'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '布団';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '毛布', '毛布'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '布団';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ソファー', 'ソファー', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は大きさにより異なるため要確認 (目安: 1人掛け700円、2人掛け以上1,000円)。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'そふぁー', 'ソファー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ソファー';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ソファ', 'ソファ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ソファー';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'カウチ', 'カウチ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ソファー';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '長椅子', '長椅子'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ソファー';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'テーブル', 'テーブル', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は大きさにより異なるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'てーぶる', 'テーブル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テーブル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '机', '机'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テーブル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'つくえ', 'ツクエ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テーブル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ダイニングテーブル', 'ダイニングテーブル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テーブル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ローテーブル', 'ローテーブル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テーブル';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '椅子', '椅子', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は種類・大きさにより異なるため要確認。最大の辺が30cm以下のものは普通ごみです。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'いす', 'イス'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '椅子';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'イス', 'イス'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '椅子';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'チェア', 'チェア'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '椅子';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '座椅子', '座椅子'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '椅子';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'タンス', 'タンス', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は大きさにより異なるため要確認。中身を空にして出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'たんす', 'タンス'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'タンス';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '箪笥', '箪笥'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'タンス';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'チェスト', 'チェスト'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'タンス';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '衣装棚', '衣装棚'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'タンス';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ベッド', 'ベッド', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は種類・大きさにより異なるため要確認。マットレスは別品目として申し込んでください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'べっど', 'ベッド'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ベッド';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'シングルベッド', 'シングルベッド'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ベッド';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'パイプベッド', 'パイプベッド'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ベッド';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '二段ベッド', '二段ベッド'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ベッド';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'マットレス', 'マットレス', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は種類 (スプリング有無など) により異なるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'まっとれす', 'マットレス'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'マットレス';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'スプリングマットレス', 'スプリングマットレス'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'マットレス';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '敷きマット', '敷キマット'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'マットレス';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'カーペット', 'カーペット', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は大きさにより異なるため要確認。丸めてひもで縛って出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かーぺっと', 'カーペット'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'カーペット';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'じゅうたん', 'ジュウタン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'カーペット';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '絨毯', '絨毯'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'カーペット';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ラグ', 'ラグ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'カーペット';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '掃除機', '掃除機', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'そうじき', 'ソウジキ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '掃除機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'クリーナー', 'クリーナー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '掃除機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'コードレス掃除機', 'コードレス掃除機'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '掃除機';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ストーブ', 'ストーブ', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。灯油と電池は必ず抜いてください。手数料は申込時に案内されるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'すとーぶ', 'ストーブ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ストーブ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '石油ストーブ', '石油ストーブ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ストーブ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ファンヒーター', 'ファンヒーター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ストーブ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '電気ストーブ', '電気ストーブ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ストーブ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '扇風機', '扇風機', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'せんぷうき', 'センプウキ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '扇風機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'サーキュレーター', 'サーキュレーター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '扇風機';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ガスコンロ', 'ガスコンロ', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。電池は抜いて出してください。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'がすこんろ', 'ガスコンロ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ガスコンロ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ガステーブル', 'ガステーブル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ガスコンロ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'コンロ', 'コンロ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ガスコンロ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'スーツケース', 'スーツケース', '粗大ごみ', NULL, '粗大ごみ (事前申込制)。手数料は申込時に案内されるため要確認。', 'https://sodai.osaka-kankyojigyo.or.jp/' FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'すーつけーす', 'スーツケース'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スーツケース';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'キャリーケース', 'キャリーケース'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スーツケース';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'キャリーバッグ', 'キャリーバッグ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スーツケース';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '旅行かばん', '旅行カバン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スーツケース';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '空き缶', '空キ缶', '資源', 0, '中を軽くすすいで資源ごみの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'あきかん', 'アキカン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空き缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '缶', '缶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空き缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'アルミ缶', 'アルミ缶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空き缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'スチール缶', 'スチール缶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空き缶';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '空きびん', '空キビン', '資源', 0, 'ふたを外し、中を軽くすすいで資源ごみの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'あきびん', 'アキビン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空きびん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '瓶', '瓶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空きびん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ビン', 'ビン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空きびん';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ガラスびん', 'ガラスビン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '空きびん';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'ペットボトル', 'ペットボトル', '資源', 0, 'キャップとラベルを外して容器包装プラスチックへ。本体は軽くすすぎ、つぶして資源ごみへ出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ぺっとぼとる', 'ペットボトル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ペットボトル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'PETボトル', 'petボトル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'ペットボトル';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'スプレー缶', 'スプレー缶', '資源', 0, '必ず中身を使い切り、穴を開けずに資源ごみの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'すぷれーかん', 'スプレーカン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スプレー缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'エアゾール缶', 'エアゾール缶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スプレー缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'カセットボンベ', 'カセットボンベ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スプレー缶';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ガス缶', 'ガス缶'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'スプレー缶';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '食品トレイ', '食品トレイ', '容器包装プラスチック', 0, '軽くすすいで容器包装プラスチックの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'しょくひんとれい', 'ショクヒントレイ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食品トレイ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'トレー', 'トレー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食品トレイ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '発泡トレイ', '発泡トレイ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '食品トレイ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'レジ袋', 'レジ袋', '容器包装プラスチック', 0, '容器包装プラスチックの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'れじぶくろ', 'レジブクロ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'レジ袋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ポリ袋', 'ポリ袋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'レジ袋';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ビニール袋', 'ビニール袋'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'レジ袋';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'シャンプーボトル', 'シャンプーボトル', '容器包装プラスチック', 0, '中身を使い切り、軽くすすいで容器包装プラスチックの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'しゃんぷーぼとる', 'シャンプーボトル'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'シャンプーボトル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'シャンプー容器', 'シャンプー容器'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'シャンプーボトル';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '詰め替えパック', '詰メ替エパック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'シャンプーボトル';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '発泡スチロール', '発泡スチロール', '容器包装プラスチック', 0, '商品の容器・包装だったものが対象です。容器包装プラスチックの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'はっぽうすちろーる', 'ハッポウスチロール'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '発泡スチロール';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'スチロール', 'スチロール'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '発泡スチロール';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '緩衝材', '緩衝材'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '発泡スチロール';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '卵パック', '卵パック', '容器包装プラスチック', 0, '容器包装プラスチックの収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'たまごぱっく', 'タマゴパック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '卵パック';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'たまごケース', 'タマゴケース'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '卵パック';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '透明パック', '透明パック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '卵パック';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '新聞', '新聞', '古紙・衣類', 0, 'ひもで十字に束ねて古紙・衣類の収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'しんぶん', 'シンブン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '新聞';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '新聞紙', '新聞紙'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '新聞';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'チラシ', 'チラシ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '新聞';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '段ボール', '段ボール', '古紙・衣類', 0, '折りたたんでひもで束ね、古紙・衣類の収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'だんぼーる', 'ダンボール'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '段ボール';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ダンボール', 'ダンボール'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '段ボール';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'カートン', 'カートン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '段ボール';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '本', '本', '古紙・衣類', 0, 'ひもで十字に束ねて古紙・衣類の収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ほん', 'ホン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '本';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '書籍', '書籍'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '本';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '雑誌', '雑誌'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '本';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '漫画', '漫画'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '本';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '単行本', '単行本'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '本';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '衣類', '衣類', '古紙・衣類', 0, '洗濯してから透明袋に入れるか、ひもで束ねて古紙・衣類の収集日に出してください。雨の日は出さないでください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'いるい', 'イルイ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '衣類';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '服', '服'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '衣類';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '洋服', '洋服'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '衣類';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'Tシャツ', 'tシャツ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '衣類';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'セーター', 'セーター'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '衣類';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '紙パック', '紙パック', '古紙・衣類', 0, 'すすいで切り開き、乾かしてから古紙・衣類の収集日に出してください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'かみぱっく', 'カミパック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙パック';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '牛乳パック', '牛乳パック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙パック';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ジュースパック', 'ジュースパック'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '紙パック';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'テレビ', 'テレビ', '収集不可', NULL, '家電リサイクル法対象のため市では収集できません。購入店・買替店に引き取りを依頼するか、郵便局でリサイクル料金 (要確認) を支払って指定引取場所へ持ち込んでください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'てれび', 'テレビ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テレビ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '液晶テレビ', '液晶テレビ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テレビ';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ブラウン管テレビ', 'ブラウン管テレビ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'テレビ';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '冷蔵庫', '冷蔵庫', '収集不可', NULL, '家電リサイクル法対象のため市では収集できません。購入店・買替店に引き取りを依頼するか、郵便局でリサイクル料金 (要確認) を支払って指定引取場所へ持ち込んでください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'れいぞうこ', 'レイゾウコ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '冷蔵庫';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '冷凍庫', '冷凍庫'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '冷蔵庫';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'フリーザー', 'フリーザー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '冷蔵庫';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, '洗濯機', '洗濯機', '収集不可', NULL, '家電リサイクル法対象のため市では収集できません。購入店・買替店に引き取りを依頼するか、郵便局でリサイクル料金 (要確認) を支払って指定引取場所へ持ち込んでください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'せんたくき', 'センタクキ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '洗濯機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'せんたっき', 'センタッキ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '洗濯機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ドラム式洗濯機', 'ドラム式洗濯機'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '洗濯機';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '衣類乾燥機', '衣類乾燥機'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = '洗濯機';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'エアコン', 'エアコン', '収集不可', NULL, '家電リサイクル法対象のため市では収集できません。購入店・買替店に引き取りを依頼するか、郵便局でリサイクル料金 (要確認) を支払って指定引取場所へ持ち込んでください。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'えあこん', 'エアコン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'エアコン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'クーラー', 'クーラー'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'エアコン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, '室外機', '室外機'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'エアコン';

INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)
  SELECT id, 'パソコン', 'パソコン', '収集不可', NULL, '資源有効利用促進法によりメーカー回収となるため市では収集できません。メーカーまたは認定事業者の宅配便回収、小型家電回収ボックスをご利用ください (料金は要確認)。', NULL FROM municipalities WHERE name = '大阪市';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ぱそこん', 'パソコン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'パソコン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'PC', 'pc'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'パソコン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'ノートパソコン', 'ノートパソコン'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'パソコン';
INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)
  SELECT wi.id, 'デスクトップ', 'デスクトップ'
  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id
  WHERE m.name = '大阪市' AND wi.name = 'パソコン';
