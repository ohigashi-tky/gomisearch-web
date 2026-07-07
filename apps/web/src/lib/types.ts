/** 自治体 (GET /api/municipalities) */
export interface Municipality {
  id: number;
  name: string;
  prefecture: string;
  bulkyWasteApplyUrl: string | null;
  sourceUrl: string;
}

/** キャッシュ用の品目 (GET /api/municipalities/{id}/items の items 要素) */
export interface WasteItem {
  id: number;
  name: string;
  category: string;
  /** 手数料 (円)。無料は 0、不明は null */
  fee: number | null;
  instructions: string;
  applyUrl: string | null;
  aliases: string[];
}

/** GET /api/municipalities/{id}/items のレスポンス */
export interface MunicipalityItemsResponse {
  municipality: Municipality;
  items: WasteItem[];
}

/** 品目一括取得の結果 (ETag による差分チェック対応) */
export type ItemsFetchResult =
  | { kind: "notModified" }
  | { kind: "updated"; response: MunicipalityItemsResponse; etag: string | null };
