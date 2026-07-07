import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { ApiError } from "../src/lib/api";
import { ItemsCacheStore } from "../src/lib/itemsCache";
import { ItemsSyncService, type ItemsFetcher } from "../src/lib/itemsSync";
import type { ItemsFetchResult } from "../src/lib/types";
import { osaka, sampleResponse } from "./sampleItems";

const municipalityId = osaka.id;

/** 呼び出しごとに挙動を差し替えられるテスト用フェッチャ (iOS 版 StubRepository 相当) */
function makeStubFetcher(
  handler: (municipalityId: number, etag: string | null) => Promise<ItemsFetchResult>,
) {
  const receivedEtags: (string | null)[] = [];
  const fetcher: ItemsFetcher = async (id, etag) => {
    receivedEtags.push(etag);
    return handler(id, etag);
  };
  return { fetcher, receivedEtags };
}

let cache: ItemsCacheStore;
let dbCounter = 0;

beforeEach(() => {
  // テストごとに独立した IndexedDB データベースを使う
  dbCounter += 1;
  cache = new ItemsCacheStore(`gomisearch-test-${Date.now()}-${dbCounter}`);
});

// iOS 版 ItemsCacheTests と同じテストケース・期待値
describe("ItemsCacheStore", () => {
  it("ETag とペイロードを往復できる", async () => {
    await cache.save(sampleResponse, '"abc123"', municipalityId);

    const loaded = await cache.load(municipalityId);
    expect(loaded?.etag).toBe('"abc123"');
    expect(loaded?.payload.municipality.name).toBe("大阪市");
    expect(loaded?.payload.items.length).toBe(sampleResponse.items.length);
  });

  it("キャッシュがなければ null", async () => {
    expect(await cache.load(999)).toBeNull();
  });

  it("キャッシュを削除できる", async () => {
    await cache.save(sampleResponse, null, municipalityId);
    await cache.remove(municipalityId);
    expect(await cache.load(municipalityId)).toBeNull();
  });
});

describe("ItemsSyncService (ETag フロー)", () => {
  it("初回取得: キャッシュがなければ ETag なしで取得し保存する", async () => {
    const { fetcher, receivedEtags } = makeStubFetcher(async () => ({
      kind: "updated",
      response: sampleResponse,
      etag: '"v1"',
    }));
    const sync = new ItemsSyncService(fetcher, cache);

    const loaded = await sync.loadItems(municipalityId);

    expect(receivedEtags).toEqual([null]);
    expect(loaded.items.length).toBe(sampleResponse.items.length);
    expect((await cache.load(municipalityId))?.etag).toBe('"v1"');
  });

  it("差分なし: 保存済み ETag を送り 304 ならキャッシュを返す", async () => {
    await cache.save(sampleResponse, '"v1"', municipalityId);
    const { fetcher, receivedEtags } = makeStubFetcher(async (_, etag) => {
      expect(etag).toBe('"v1"');
      return { kind: "notModified" };
    });
    const sync = new ItemsSyncService(fetcher, cache);

    const loaded = await sync.loadItems(municipalityId);

    expect(receivedEtags).toEqual(['"v1"']);
    expect(loaded.items.length).toBe(sampleResponse.items.length);
    // キャッシュはそのまま
    expect((await cache.load(municipalityId))?.etag).toBe('"v1"');
  });

  it("差分あり: 200 なら新しいデータと ETag で置き換える", async () => {
    await cache.save(sampleResponse, '"v1"', municipalityId);
    const updatedResponse = {
      municipality: sampleResponse.municipality,
      items: sampleResponse.items.slice(0, 3),
    };
    const { fetcher } = makeStubFetcher(async () => ({
      kind: "updated",
      response: updatedResponse,
      etag: '"v2"',
    }));
    const sync = new ItemsSyncService(fetcher, cache);

    const loaded = await sync.loadItems(municipalityId);

    expect(loaded.items.length).toBe(3);
    const envelope = await cache.load(municipalityId);
    expect(envelope?.etag).toBe('"v2"');
    expect(envelope?.payload.items.length).toBe(3);
  });

  it("オフライン: 通信エラー時はキャッシュにフォールバックする", async () => {
    await cache.save(sampleResponse, '"v1"', municipalityId);
    const { fetcher } = makeStubFetcher(async () => {
      throw new ApiError("network");
    });
    const sync = new ItemsSyncService(fetcher, cache);

    const loaded = await sync.loadItems(municipalityId);

    expect(loaded.items.length).toBe(sampleResponse.items.length);
  });

  it("オフライン: キャッシュもなければエラーを投げる", async () => {
    const { fetcher } = makeStubFetcher(async () => {
      throw new ApiError("network");
    });
    const sync = new ItemsSyncService(fetcher, cache);

    await expect(sync.loadItems(municipalityId)).rejects.toThrow();
  });

  it("異常系: 304 なのにキャッシュがない場合は ETag なしで取り直す", async () => {
    // 1回目の呼び出しでは notModified を返し、取り直しの2回目で 200 を返す
    let callCount = 0;
    const { fetcher } = makeStubFetcher(async () => {
      callCount += 1;
      if (callCount === 1) {
        return { kind: "notModified" };
      }
      return { kind: "updated", response: sampleResponse, etag: '"v1"' };
    });
    const sync = new ItemsSyncService(fetcher, cache);

    const loaded = await sync.loadItems(municipalityId);

    expect(callCount).toBe(2);
    expect(loaded.items.length).toBe(sampleResponse.items.length);
  });
});
