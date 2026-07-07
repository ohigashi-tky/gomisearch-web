/**
 * seed/osaka-items.json から migrations/0002_seed_osaka.sql を生成する。
 *
 *   pnpm --filter @gomisearch/api seed:generate
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

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, "..", "seed", "osaka-items.json");
const outPath = join(here, "..", "migrations", "0002_seed_osaka.sql");

const raw = JSON.parse(readFileSync(seedPath, "utf-8"));
const seed = seedFileSchema.parse(raw);

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlValue(value: string | number | null): string {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return sqlString(value);
}

const lines: string[] = [
  "-- Migration number: 0002 \t seed: 大阪市 50品目",
  "-- このファイルは scripts/generate-seed.ts により seed/osaka-items.json から生成される。直接編集しないこと。",
  "",
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

writeFileSync(outPath, lines.join("\n"));
console.log(
  `generated ${outPath} (${seed.items.length} items, ${seed.items.reduce(
    (n, i) => n + i.aliases.length,
    0,
  )} aliases)`,
);
