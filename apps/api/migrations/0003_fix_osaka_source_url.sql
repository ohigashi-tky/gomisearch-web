-- 大阪市サイトの改編で出典URL (0000369973.html) がリンク切れになったため、
-- 現行の「品目別収集区分一覧表（50音順）」ページへ更新する
UPDATE municipalities
SET source_url = 'https://www.city.osaka.lg.jp/kankyo/page/0000201907.html'
WHERE name = '大阪市' AND prefecture = '大阪府';
