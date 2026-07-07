import { escapeLikePattern, normalizeForSearch } from "@gomisearch/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { municipalities, wasteItemAliases, wasteItems } from "../db/schema";

export type Db = DrizzleD1Database;

export interface SearchResultItem {
  id: number;
  name: string;
  category: string;
  fee: number | null;
  instructions: string;
  applyUrl: string | null;
  sourceUrl: string;
}

export interface SuggestionItem {
  id: number;
  name: string;
}

const itemSelection = {
  id: wasteItems.id,
  name: wasteItems.name,
  category: wasteItems.category,
  fee: wasteItems.fee,
  instructions: wasteItems.instructions,
  applyUrl: wasteItems.applyUrl,
  sourceUrl: municipalities.sourceUrl,
};

function aliasMatchSubquery(db: Db, pattern: string) {
  return db
    .select({ id: wasteItemAliases.wasteItemId })
    .from(wasteItemAliases)
    .where(sql`${wasteItemAliases.aliasNormalized} LIKE ${pattern} ESCAPE '\\'`);
}

/**
 * name / alias の部分一致検索。クエリはカタカナへ正規化して比較する。
 */
export async function searchItems(
  db: Db,
  municipalityId: number,
  query: string,
  limit = 20,
): Promise<SearchResultItem[]> {
  const normalized = normalizeForSearch(query);
  if (normalized.length === 0) return [];
  const pattern = `%${escapeLikePattern(normalized)}%`;

  return db
    .select(itemSelection)
    .from(wasteItems)
    .innerJoin(municipalities, eq(wasteItems.municipalityId, municipalities.id))
    .where(
      and(
        eq(wasteItems.municipalityId, municipalityId),
        sql`(${wasteItems.nameNormalized} LIKE ${pattern} ESCAPE '\\' OR ${inArray(
          wasteItems.id,
          aliasMatchSubquery(db, pattern),
        )})`,
      ),
    )
    .orderBy(wasteItems.name)
    .limit(limit);
}

/**
 * 前方一致でのゆるい候補検索。
 * クエリ全体で部分一致が 0 件だったとき、クエリの先頭部分を徐々に短くしながら
 * 前方一致で探し、最初に見つかった候補を返す。
 */
export async function findSuggestions(
  db: Db,
  municipalityId: number,
  query: string,
  limit = 5,
): Promise<SuggestionItem[]> {
  const normalized = normalizeForSearch(query);
  for (let len = normalized.length; len >= 1; len--) {
    const prefix = normalized.slice(0, len);
    const rows = await prefixMatchItems(db, municipalityId, prefix, limit);
    if (rows.length > 0) return rows;
  }
  return [];
}

/**
 * オートコンプリート用: name / alias の前方一致 → 部分一致の順で最大 limit 件。
 */
export async function suggestItems(
  db: Db,
  municipalityId: number,
  query: string,
  limit = 10,
): Promise<SuggestionItem[]> {
  const normalized = normalizeForSearch(query);
  if (normalized.length === 0) return [];

  const results: SuggestionItem[] = [];
  const seen = new Set<number>();

  const prefixRows = await prefixMatchItems(db, municipalityId, normalized, limit);
  for (const row of prefixRows) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      results.push(row);
    }
  }

  if (results.length < limit) {
    const pattern = `%${escapeLikePattern(normalized)}%`;
    const substringRows = await db
      .select({ id: wasteItems.id, name: wasteItems.name })
      .from(wasteItems)
      .where(
        and(
          eq(wasteItems.municipalityId, municipalityId),
          sql`(${wasteItems.nameNormalized} LIKE ${pattern} ESCAPE '\\' OR ${inArray(
            wasteItems.id,
            aliasMatchSubquery(db, pattern),
          )})`,
        ),
      )
      .orderBy(wasteItems.name)
      .limit(limit);
    for (const row of substringRows) {
      if (results.length >= limit) break;
      if (!seen.has(row.id)) {
        seen.add(row.id);
        results.push(row);
      }
    }
  }

  return results;
}

async function prefixMatchItems(
  db: Db,
  municipalityId: number,
  normalizedPrefix: string,
  limit: number,
): Promise<SuggestionItem[]> {
  const pattern = `${escapeLikePattern(normalizedPrefix)}%`;
  return db
    .select({ id: wasteItems.id, name: wasteItems.name })
    .from(wasteItems)
    .where(
      and(
        eq(wasteItems.municipalityId, municipalityId),
        sql`(${wasteItems.nameNormalized} LIKE ${pattern} ESCAPE '\\' OR ${inArray(
          wasteItems.id,
          aliasMatchSubquery(db, pattern),
        )})`,
      ),
    )
    .orderBy(wasteItems.name)
    .limit(limit);
}
