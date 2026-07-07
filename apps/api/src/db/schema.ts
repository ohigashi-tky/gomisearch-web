import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const municipalities = sqliteTable("municipalities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  prefecture: text("prefecture").notNull(),
  bulkyWasteApplyUrl: text("bulky_waste_apply_url"),
  sourceUrl: text("source_url").notNull(),
});

export const wasteItems = sqliteTable(
  "waste_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    municipalityId: integer("municipality_id")
      .notNull()
      .references(() => municipalities.id),
    name: text("name").notNull(),
    // 検索用にカタカナへ寄せた正規化済みの名前 (packages/schema の normalizeForSearch)
    nameNormalized: text("name_normalized").notNull(),
    category: text("category").notNull(),
    // 手数料 (円)。無料は 0、不明は null
    fee: integer("fee"),
    instructions: text("instructions").notNull(),
    applyUrl: text("apply_url"),
  },
  (t) => [
    uniqueIndex("idx_waste_items_municipality_name").on(t.municipalityId, t.name),
    index("idx_waste_items_name_normalized").on(t.nameNormalized),
  ],
);

export const wasteItemAliases = sqliteTable(
  "waste_item_aliases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    wasteItemId: integer("waste_item_id")
      .notNull()
      .references(() => wasteItems.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    aliasNormalized: text("alias_normalized").notNull(),
  },
  (t) => [
    index("idx_waste_item_aliases_alias").on(t.alias),
    index("idx_waste_item_aliases_alias_normalized").on(t.aliasNormalized),
  ],
);

export const municipalityRequests = sqliteTable("municipality_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  municipalityName: text("municipality_name").notNull(),
  createdAt: text("created_at").notNull(),
});
