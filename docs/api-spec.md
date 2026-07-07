# gomisearch API 仕様

iOS アプリ (apps/ios) から利用する JSON API。実装 (apps/api) は必ずこの仕様に従うこと。
**API を変更する場合は、先にこのファイルを更新してから実装を変更する。**

- ベース URL: `https://<worker-domain>` (ローカル開発時は `http://localhost:8787`)
- すべてのレスポンスは `application/json; charset=UTF-8`
- 文字列パラメータは URL エンコードして送る
- エラーレスポンスは共通で `{ "error": "メッセージ" }`
  - `400` パラメータ不正 / `404` 対象なし / `429` レートリミット / `500` サーバエラー

## かな正規化 (検索の共通仕様)

品目検索 (`/api/search`, `/api/suggest`) では、ひらがな / カタカナ / 半角カナ /
全角英数の表記ゆれを吸収するため、**比較時にカタカナへ寄せる正規化**を行う。

- Unicode NFKC 正規化 → 英字小文字化 → ひらがな→カタカナ変換
- 正規化ユーティリティは `packages/schema` の `normalizeForSearch` に実装し、
  DB 側にも正規化済みカラム (`name_normalized` / `alias_normalized`) を保持する
- 例: `じてんしゃ` → `ジテンシャ`、`ｽﾆｰｶｰ` → `スニーカー`、`ＣＤ` → `cd`

---

## GET /api/municipalities?q={keyword}

自治体名の部分一致検索。初回起動時の自治体選択に使う。

- `q`: 検索キーワード。`name` / `prefecture` に対する部分一致。省略時は全件 (最大50件)

### レスポンス 200

```json
{
  "municipalities": [
    {
      "id": 1,
      "name": "大阪市",
      "prefecture": "大阪府",
      "bulkyWasteApplyUrl": "https://sodai.osaka-kankyojigyo.or.jp/",
      "sourceUrl": "https://www.city.osaka.lg.jp/kankyo/page/0000369973.html"
    }
  ]
}
```

---

## GET /api/search?q={keyword}&municipality_id={id}

品目検索。`waste_items.name` と `waste_item_aliases.alias` の部分一致
(かな正規化あり)。ヒットが 0 件のときは、クエリの先頭部分を徐々に短くしながら
前方一致で探した「ゆるい候補」を `suggestions` に返す。

- `q` (必須): 検索キーワード
- `municipality_id` (必須): 自治体 ID (正の整数)

### レスポンス 200

```json
{
  "items": [
    {
      "id": 17,
      "name": "自転車",
      "category": "粗大ごみ",
      "fee": 400,
      "instructions": "粗大ごみ (事前申込制)。粗大ごみ処理手数料券400円を貼り、収集日に指定場所へ出してください。",
      "applyUrl": "https://sodai.osaka-kankyojigyo.or.jp/",
      "sourceUrl": "https://www.city.osaka.lg.jp/kankyo/page/0000369973.html"
    }
  ],
  "suggestions": []
}
```

- `category`: `普通ごみ` / `粗大ごみ` / `資源` / `容器包装プラスチック` / `古紙・衣類` / `収集不可`
- `fee`: 手数料 (円)。無料は `0`、不明は `null`
- `items` が空のとき `suggestions: [{ "id": 17, "name": "自転車" }]` の形式で最大5件
- `q` または `municipality_id` が不正な場合は 400

---

## GET /api/suggest?q={keyword}&municipality_id={id}

オートコンプリート候補。name / alias に対して前方一致 → 部分一致の順で探し、
上位 10 件を返す。

- `q` (必須), `municipality_id` (必須): `/api/search` と同じ

### レスポンス 200

```json
{
  "suggestions": [
    { "id": 22, "name": "電子レンジ" }
  ]
}
```

---

## GET /api/municipalities/{id}/items

自治体の全品目一括取得。iOS 側のオフラインキャッシュ用。

### ETag / 304

- レスポンスには常に `ETag` ヘッダ (ボディの SHA-1) を付ける
- クライアントは前回の ETag を `If-None-Match` で送る
- 差分がなければボディなしの `304 Not Modified` (+ 同じ `ETag`) を返す

### レスポンス 200

```json
{
  "municipality": {
    "id": 1,
    "name": "大阪市",
    "prefecture": "大阪府",
    "bulkyWasteApplyUrl": "https://sodai.osaka-kankyojigyo.or.jp/",
    "sourceUrl": "https://www.city.osaka.lg.jp/kankyo/page/0000369973.html"
  },
  "items": [
    {
      "id": 1,
      "name": "靴",
      "category": "普通ごみ",
      "fee": 0,
      "instructions": "普通ごみの収集日に中身の見えるごみ袋に入れて出してください。",
      "applyUrl": null,
      "aliases": ["くつ", "スニーカー", "ブーツ", "革靴", "サンダル"]
    }
  ]
}
```

- 存在しない自治体 ID の場合は 404

---

## POST /api/requests

未対応自治体の対応リクエストを保存する。

### リクエストボディ

```json
{ "municipalityName": "京都市" }
```

- `municipalityName` (必須): 1〜100 文字

### レスポンス 201

```json
{ "id": 1, "municipalityName": "京都市", "createdAt": "2026-07-05T00:00:00.000Z" }
```

### レートリミット (連投対策)

IP ベースの簡易レートリミット (Workers の isolate 内メモリによるベストエフォート):

- 同一 IP から 60 秒間に最大 5 回
- 同一 IP + 同一自治体名 (かな正規化後) は 10 分間に 1 回
- 超過時は `429` と `{ "error": "..." }`
