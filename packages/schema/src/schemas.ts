import { z } from "zod";

/** 分別区分 (全国の自治体で追加があり得るが、現時点でサポートする区分) */
export const WASTE_CATEGORIES = [
  "普通ごみ",
  "不燃ごみ",
  "粗大ごみ",
  "資源",
  "容器包装プラスチック",
  "古紙・衣類",
  "危険ごみ",
  "収集不可",
] as const;

export type WasteCategory = (typeof WASTE_CATEGORIES)[number];

export const wasteCategorySchema = z.enum(WASTE_CATEGORIES);

/**
 * ingest / シードで扱う品目1件の入力スキーマ。
 * fee: 円。無料は 0、不明は null。
 */
export const wasteItemInputSchema = z.object({
  name: z.string().min(1),
  category: wasteCategorySchema,
  fee: z.number().int().min(0).nullable(),
  instructions: z.string().min(1),
  applyUrl: z.string().url().nullable().default(null),
  aliases: z.array(z.string().min(1)).default([]),
});

export type WasteItemInput = z.infer<typeof wasteItemInputSchema>;

/** ingest CLI に渡す自治体設定ファイルのスキーマ */
export const municipalityConfigSchema = z.object({
  name: z.string().min(1),
  prefecture: z.string().min(1),
  /** 分別情報の出典として DB に保存する代表 URL */
  sourceUrl: z.string().url(),
  /** 取り込み対象の分別ページ URL 群 */
  sourceUrls: z.array(z.string().url()).min(1),
  bulkyWasteApplyUrl: z.string().url().nullable().default(null),
});

export type MunicipalityConfig = z.infer<typeof municipalityConfigSchema>;

/** POST /api/requests のリクエストボディ */
export const municipalityRequestSchema = z.object({
  municipalityName: z.string().trim().min(1).max(100),
});
