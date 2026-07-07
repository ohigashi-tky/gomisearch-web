import type { MunicipalityItemsResponse } from "./types";

export interface CacheEnvelope {
  etag: string | null;
  cachedAt: string;
  payload: MunicipalityItemsResponse;
}

const STORE_NAME = "itemsCache";

/**
 * 品目一覧のブラウザキャッシュ (IndexedDB + ETag)。
 * 自治体 ID ごとに 1 レコード保存する (iOS 版 ItemsCacheStore 相当)。
 */
export class ItemsCacheStore {
  private readonly dbName: string;

  /** - dbName: テスト時は一意な名前を渡して分離する */
  constructor(dbName = "gomisearch") {
    this.dbName = dbName;
  }

  async load(municipalityId: number): Promise<CacheEnvelope | null> {
    try {
      const db = await this.open();
      try {
        const envelope = await requestToPromise<CacheEnvelope | undefined>(
          db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(municipalityId),
        );
        return envelope ?? null;
      } finally {
        db.close();
      }
    } catch {
      return null;
    }
  }

  async save(
    payload: MunicipalityItemsResponse,
    etag: string | null,
    municipalityId: number,
  ): Promise<void> {
    const envelope: CacheEnvelope = {
      etag,
      cachedAt: new Date().toISOString(),
      payload,
    };
    const db = await this.open();
    try {
      await requestToPromise(
        db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(envelope, municipalityId),
      );
    } finally {
      db.close();
    }
  }

  async remove(municipalityId: number): Promise<void> {
    try {
      const db = await this.open();
      try {
        await requestToPromise(
          db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(municipalityId),
        );
      } finally {
        db.close();
      }
    } catch {
      // iOS 版 remove と同様、失敗は無視する
    }
  }

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("indexedDB open failed"));
    });
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexedDB request failed"));
  });
}
