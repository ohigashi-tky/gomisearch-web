/**
 * seed/*.json からシードマイグレーション SQL を生成する。
 *
 *   pnpm --filter @gomisearch/api seed:generate
 *
 * - seed/osaka-items.json                → migrations/0002_seed_osaka.sql
 * - seed/<city>-items.json (政令指定都市) → migrations/0004_seed_designated_cities.sql
 *
 * name_normalized / alias_normalized は packages/schema の normalizeForSearch で
 * 生成するため、正規化ロジックの変更時はこのスクリプトを再実行すること。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizeForSearch,
  wasteItemInputSchema,
} from "@gomisearch/schema";
import { z } from "zod";

const seedFileSchema = z.object({
  municipality: z.object({
    name: z.string().min(1),
    prefecture: z.string().min(1),
    bulkyWasteApplyUrl: z.string().url().nullable(),
    sourceUrl: z.string().url(),
  }),
  items: z.array(wasteItemInputSchema).length(50),
});

type SeedFile = z.infer<typeof seedFileSchema>;

const here = dirname(fileURLToPath(import.meta.url));
const seedDir = join(here, "..", "seed");
const migrationsDir = join(here, "..", "migrations");

/** 生成対象: 1マイグレーションに複数自治体をまとめられる */
const MIGRATIONS: { out: string; header: string; seedFiles: string[] }[] = [
  {
    out: "0002_seed_osaka.sql",
    header: "-- Migration number: 0002 \t seed: 大阪市 50品目",
    seedFiles: ["osaka-items.json"],
  },
  {
    out: "0004_seed_designated_cities.sql",
    header: "-- Migration number: 0004 \t seed: 政令指定都市19市 各50品目",
    seedFiles: [
      "sapporo-items.json",
      "sendai-items.json",
      "saitama-items.json",
      "chiba-items.json",
      "yokohama-items.json",
      "kawasaki-items.json",
      "sagamihara-items.json",
      "niigata-items.json",
      "shizuoka-items.json",
      "hamamatsu-items.json",
      "nagoya-items.json",
      "kyoto-items.json",
      "sakai-items.json",
      "kobe-items.json",
      "okayama-items.json",
      "hiroshima-items.json",
      "kitakyushu-items.json",
      "fukuoka-items.json",
      "kumamoto-items.json",
    ],
  },
];

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlValue(value: string | number | null): string {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return sqlString(value);
}

function municipalityLines(seed: SeedFile): string[] {
  const lines: string[] = [
    `INSERT INTO municipalities (name, prefecture, bulky_waste_apply_url, source_url) VALUES (${[
      sqlValue(seed.municipality.name),
      sqlValue(seed.municipality.prefecture),
      sqlValue(seed.municipality.bulkyWasteApplyUrl),
      sqlValue(seed.municipality.sourceUrl),
    ].join(", ")});`,
    "",
  ];

  for (const item of seed.items) {
    lines.push(
      `INSERT INTO waste_items (municipality_id, name, name_normalized, category, fee, instructions, apply_url)`,
      `  SELECT id, ${[
        sqlValue(item.name),
        sqlValue(normalizeForSearch(item.name)),
        sqlValue(item.category),
        sqlValue(item.fee),
        sqlValue(item.instructions),
        sqlValue(item.applyUrl),
      ].join(", ")} FROM municipalities WHERE name = ${sqlString(seed.municipality.name)};`,
    );
    for (const alias of item.aliases) {
      lines.push(
        `INSERT INTO waste_item_aliases (waste_item_id, alias, alias_normalized)`,
        `  SELECT wi.id, ${sqlValue(alias)}, ${sqlValue(normalizeForSearch(alias))}`,
        `  FROM waste_items wi JOIN municipalities m ON wi.municipality_id = m.id`,
        `  WHERE m.name = ${sqlString(seed.municipality.name)} AND wi.name = ${sqlString(item.name)};`,
      );
    }
    lines.push("");
  }
  return lines;
}

for (const migration of MIGRATIONS) {
  const lines: string[] = [
    migration.header,
    "-- このファイルは scripts/generate-seed.ts により seed/*.json から生成される。直接編集しないこと。",
    "",
  ];
  let itemCount = 0;
  let aliasCount = 0;
  for (const seedFile of migration.seedFiles) {
    const raw = JSON.parse(readFileSync(join(seedDir, seedFile), "utf-8"));
    const seed = seedFileSchema.parse(raw);
    lines.push(...municipalityLines(seed));
    itemCount += seed.items.length;
    aliasCount += seed.items.reduce((n, i) => n + i.aliases.length, 0);
  }
  const outPath = join(migrationsDir, migration.out);
  writeFileSync(outPath, lines.join("\n"));
  console.log(
    `generated ${outPath} (${migration.seedFiles.length} municipalities, ${itemCount} items, ${aliasCount} aliases)`,
  );
}
