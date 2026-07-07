import { applyD1Migrations, env } from "cloudflare:test";

// スキーマ + 大阪市シードのマイグレーションをテスト用 D1 に適用する
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
