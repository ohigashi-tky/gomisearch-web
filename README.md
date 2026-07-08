# gomisearch-web

品目名で検索すると自治体ごとのゴミの捨て方が即答されるサービスの Web 版 (PWA) モノレポ。

- `apps/web` — PWA フロントエンド (Vite + React 19 + TypeScript + Tailwind CSS v4 + vite-plugin-pwa)
- `apps/api` — JSON API (Hono + Cloudflare Workers + D1 + drizzle-orm)。
  大阪市 + 政令指定都市19市 (計20自治体・各50品目) のシード付き
- `packages/schema` — かな正規化 `normalizeForSearch` と zod スキーマ (サーバ/Web で共用)
- `docs/api-spec.md` — API 仕様。**API を変更する場合は、先にこのファイルを更新してから実装を変更する**

本番は apps/api の Worker に Web 版のビルド成果物を [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) として同梱し、同一オリジンで `/` (PWA) と `/api` を配信する (CORS 不要)。

## 必要なもの

- Node.js >= 20
- pnpm 10 (`corepack enable` 推奨)

## 開発手順

```sh
pnpm install

# 1. ローカル D1 にマイグレーション + シード (大阪市50品目) を適用
pnpm --filter @gomisearch/api db:migrate:local

# 2. API (wrangler dev, http://localhost:8787)
pnpm dev

# 3. 別ターミナルで Web (vite dev, http://localhost:5173)
pnpm dev:web
```

vite dev server は `/api` を `http://localhost:8787` にプロキシする。
http://localhost:5173 を開き、自治体を検索して選択 (例: 大阪) → 品目名で検索
(例: 「スニーカー」→ 靴、「じてんしゃ」→ 自転車) → タップで詳細、の流れが動く。

選択した自治体は localStorage に、品目一覧は IndexedDB に ETag 付きでキャッシュされる。
起動時に `If-None-Match` で差分チェックし (304 ならキャッシュ維持、200 なら置き換え)、
通信エラー時はキャッシュにフォールバックするため検索はオフラインでも動く。

## テスト

```sh
pnpm test               # 全ワークスペース (schema / api / web)
pnpm --filter @gomisearch/web test   # Web のみ (ローカル検索・ETagキャッシュ)
```

## ビルド

```sh
pnpm build   # apps/web → apps/web/dist (Worker が配信する静的アセット)
```

PWA アイコンを作り直す場合は `pnpm --filter @gomisearch/web icons:generate`。

## Cloudflare へのデプロイ (PWA + API 同時配信)

```sh
# 0. Cloudflare にログイン
pnpm --filter @gomisearch/api exec wrangler login

# 1. D1 データベースを作成し、出力された database_id を
#    apps/api/wrangler.toml の [[d1_databases]] に設定する
pnpm --filter @gomisearch/api exec wrangler d1 create gomisearch-db

# 2. 本番 D1 にマイグレーション + シードを適用
pnpm --filter @gomisearch/api db:migrate:remote

# 3. Web をビルドして Worker をデプロイ (静的アセットとして同梱される)
pnpm deploy
```

`pnpm deploy` は `apps/web` のビルド → `wrangler deploy` を順に実行する。
デプロイ後は Worker のドメイン 1 つで `/` が PWA、`/api/*` が API になる
(`wrangler.toml` の `run_worker_first = ["/api/*"]`)。
PC / Android / iOS Safari で「ホーム画面に追加」からインストールできる。
