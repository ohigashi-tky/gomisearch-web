import { municipalityRequestSchema } from "@gomisearch/schema";
import { asc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import {
  municipalities,
  municipalityRequests,
  wasteItemAliases,
  wasteItems,
} from "./db/schema";
import { computeEtag, etagMatches } from "./lib/etag";
import { checkRateLimit } from "./lib/rateLimit";
import { findSuggestions, searchItems, suggestItems } from "./lib/search";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

function badRequest(message: string) {
  return { error: message };
}

function parseMunicipalityId(value: string | undefined): number | null {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * GET /api/municipalities?q={keyword}
 * 自治体名の部分一致検索 (name / prefecture 対象)。
 */
app.get("/api/municipalities", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  const db = drizzle(c.env.DB);

  const rows = await db
    .select()
    .from(municipalities)
    .where(
      q.length > 0
        ? or(
            like(municipalities.name, `%${q}%`),
            like(municipalities.prefecture, `%${q}%`),
          )
        : undefined,
    )
    .orderBy(asc(municipalities.id))
    .limit(50);

  return c.json({
    municipalities: rows.map((m) => ({
      id: m.id,
      name: m.name,
      prefecture: m.prefecture,
      bulkyWasteApplyUrl: m.bulkyWasteApplyUrl,
      sourceUrl: m.sourceUrl,
    })),
  });
});

/**
 * GET /api/search?q={keyword}&municipality_id={id}
 * 品目名・別名の部分一致検索。0 件時は前方一致の suggestions を返す。
 */
app.get("/api/search", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  const municipalityId = parseMunicipalityId(c.req.query("municipality_id"));

  if (q.length === 0) {
    return c.json(badRequest("query parameter 'q' is required"), 400);
  }
  if (municipalityId === null) {
    return c.json(
      badRequest("query parameter 'municipality_id' must be a positive integer"),
      400,
    );
  }

  const db = drizzle(c.env.DB);
  const items = await searchItems(db, municipalityId, q);
  const suggestions =
    items.length === 0 ? await findSuggestions(db, municipalityId, q) : [];

  return c.json({ items, suggestions });
});

/**
 * GET /api/suggest?q={keyword}&municipality_id={id}
 * オートコンプリート候補 (name / alias、上位 10 件)。
 */
app.get("/api/suggest", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  const municipalityId = parseMunicipalityId(c.req.query("municipality_id"));

  if (q.length === 0) {
    return c.json(badRequest("query parameter 'q' is required"), 400);
  }
  if (municipalityId === null) {
    return c.json(
      badRequest("query parameter 'municipality_id' must be a positive integer"),
      400,
    );
  }

  const db = drizzle(c.env.DB);
  const suggestions = await suggestItems(db, municipalityId, q, 10);
  return c.json({ suggestions });
});

/**
 * GET /api/municipalities/{id}/items
 * 自治体の全品目一括取得 (iOS のオフラインキャッシュ用)。ETag 対応。
 */
app.get("/api/municipalities/:id/items", async (c) => {
  const municipalityId = parseMunicipalityId(c.req.param("id"));
  if (municipalityId === null) {
    return c.json(badRequest("path parameter 'id' must be a positive integer"), 400);
  }

  const db = drizzle(c.env.DB);
  const [municipality] = await db
    .select()
    .from(municipalities)
    .where(eq(municipalities.id, municipalityId))
    .limit(1);
  if (!municipality) {
    return c.json({ error: "municipality not found" }, 404);
  }

  const items = await db
    .select({
      id: wasteItems.id,
      name: wasteItems.name,
      category: wasteItems.category,
      fee: wasteItems.fee,
      instructions: wasteItems.instructions,
      applyUrl: wasteItems.applyUrl,
    })
    .from(wasteItems)
    .where(eq(wasteItems.municipalityId, municipalityId))
    .orderBy(asc(wasteItems.id));

  const aliases = await db
    .select({
      wasteItemId: wasteItemAliases.wasteItemId,
      alias: wasteItemAliases.alias,
    })
    .from(wasteItemAliases)
    .innerJoin(wasteItems, eq(wasteItemAliases.wasteItemId, wasteItems.id))
    .where(eq(wasteItems.municipalityId, municipalityId))
    .orderBy(asc(wasteItemAliases.id));

  const aliasMap = new Map<number, string[]>();
  for (const row of aliases) {
    const list = aliasMap.get(row.wasteItemId) ?? [];
    list.push(row.alias);
    aliasMap.set(row.wasteItemId, list);
  }

  const body = JSON.stringify({
    municipality: {
      id: municipality.id,
      name: municipality.name,
      prefecture: municipality.prefecture,
      bulkyWasteApplyUrl: municipality.bulkyWasteApplyUrl,
      sourceUrl: municipality.sourceUrl,
    },
    items: items.map((item) => ({
      ...item,
      aliases: aliasMap.get(item.id) ?? [],
    })),
  });

  const etag = await computeEtag(body);
  if (etagMatches(c.req.header("If-None-Match"), etag)) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ETag: etag,
      "Cache-Control": "no-cache",
    },
  });
});

/**
 * POST /api/requests
 * 未対応自治体の対応リクエストを保存する。IP ベースの簡易レートリミット付き。
 */
app.post("/api/requests", async (c) => {
  let json: unknown;
  try {
    json = await c.req.json();
  } catch {
    return c.json(badRequest("request body must be JSON"), 400);
  }

  const parsed = municipalityRequestSchema.safeParse(json);
  if (!parsed.success) {
    return c.json(badRequest("municipalityName is required"), 400);
  }
  const { municipalityName } = parsed.data;

  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown";

  const result = checkRateLimit(ip, municipalityName);
  if (!result.allowed) {
    const message =
      result.reason === "duplicate_request"
        ? "the same municipality was requested recently"
        : "too many requests";
    return c.json({ error: message }, 429);
  }

  const db = drizzle(c.env.DB);
  const [inserted] = await db
    .insert(municipalityRequests)
    .values({
      municipalityName,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return c.json(
    {
      id: inserted.id,
      municipalityName: inserted.municipalityName,
      createdAt: inserted.createdAt,
    },
    201,
  );
});

app.notFound((c) => c.json({ error: "not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "internal server error" }, 500);
});

export default app;
