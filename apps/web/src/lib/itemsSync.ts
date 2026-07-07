import { fetchItems as fetchItemsFromApi, ApiError } from "./api";
import { ItemsCacheStore } from "./itemsCache";
import type { ItemsFetchResult, MunicipalityItemsResponse } from "./types";

export type ItemsFetcher = (
  municipalityId: number,
  etag: string | null,
) => Promise<ItemsFetchResult>;

/**
 * キャッシュ優先 + ETag 差分チェックで品目一覧を取得する (iOS 版 ItemsSyncService 相当)。
 *
 * - キャッシュがあれば ETag 付きで問い合わせ、304 ならキャッシュをそのまま使う
 * - 200 ならキャッシュを新しいデータと ETag で置き換える
 * - 通信エラー (オフライン等) 時はキャッシュにフォールバックする
 */
export class ItemsSyncService {
  private readonly fetchItems: ItemsFetcher;
  private readonly cache: ItemsCacheStore;

  constructor(fetchItems: ItemsFetcher = fetchItemsFromApi, cache = new ItemsCacheStore()) {
    this.fetchItems = fetchItems;
    this.cache = cache;
  }

  async loadItems(municipalityId: number): Promise<MunicipalityItemsResponse> {
    const cached = await this.cache.load(municipalityId);
    try {
      const result = await this.fetchItems(municipalityId, cached?.etag ?? null);
      if (result.kind === "notModified") {
        if (cached) {
          return cached.payload;
        }
        // 304 なのに手元にキャッシュがない場合は ETag なしで取り直す
        return await this.forceFetch(municipalityId);
      }
      await this.trySave(result.response, result.etag, municipalityId);
      return result.response;
    } catch (error) {
      // オフライン等で失敗した場合はキャッシュにフォールバック
      if (cached) {
        return cached.payload;
      }
      throw error;
    }
  }

  private async forceFetch(municipalityId: number): Promise<MunicipalityItemsResponse> {
    const result = await this.fetchItems(municipalityId, null);
    if (result.kind === "updated") {
      await this.trySave(result.response, result.etag, municipalityId);
      return result.response;
    }
    throw new ApiError("invalidResponse");
  }

  private async trySave(
    response: MunicipalityItemsResponse,
    etag: string | null,
    municipalityId: number,
  ): Promise<void> {
    try {
      await this.cache.save(response, etag, municipalityId);
    } catch {
      // キャッシュ保存の失敗は無視する (iOS 版 try? cache.save と同様)
    }
  }
}
