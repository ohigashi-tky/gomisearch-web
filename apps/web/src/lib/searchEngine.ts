import { normalizeForSearch } from "@gomisearch/schema";
import type { WasteItem } from "./types";

interface Entry {
  item: WasteItem;
  normalizedName: string;
  normalizedAliases: string[];
}

function byName(a: WasteItem, b: WasteItem): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * 端末キャッシュに対するローカル検索エンジン。
 * name / aliases をかな正規化して部分一致で検索する (オフラインでも動作)。
 * iOS 版 LocalSearchEngine と同じ挙動。
 */
export class LocalSearchEngine {
  private readonly entries: Entry[];

  constructor(items: WasteItem[]) {
    this.entries = items.map((item) => ({
      item,
      normalizedName: normalizeForSearch(item.name),
      normalizedAliases: item.aliases.map((alias) => normalizeForSearch(alias)),
    }));
  }

  get isEmpty(): boolean {
    return this.entries.length === 0;
  }

  get itemCount(): number {
    return this.entries.length;
  }

  /** name / alias の部分一致検索 (かな正規化あり)。品目名順で返す */
  search(query: string): WasteItem[] {
    const normalized = normalizeForSearch(query);
    if (normalized.length === 0) return [];
    return this.entries
      .filter(
        (entry) =>
          entry.normalizedName.includes(normalized) ||
          entry.normalizedAliases.some((alias) => alias.includes(normalized)),
      )
      .map((entry) => entry.item)
      .sort(byName);
  }

  /**
   * 0件時のゆるい候補。クエリの先頭部分を徐々に短くしながら前方一致で探し、
   * 最初に見つかった候補を最大 limit 件返す (サーバ側 findSuggestions と同じ挙動)
   */
  suggestions(query: string, limit = 5): WasteItem[] {
    let prefix = normalizeForSearch(query);
    while (prefix.length > 0) {
      const currentPrefix = prefix;
      const hits = this.entries
        .filter(
          (entry) =>
            entry.normalizedName.startsWith(currentPrefix) ||
            entry.normalizedAliases.some((alias) => alias.startsWith(currentPrefix)),
        )
        .map((entry) => entry.item)
        .sort(byName);
      if (hits.length > 0) {
        return hits.slice(0, limit);
      }
      prefix = prefix.slice(0, -1);
    }
    return [];
  }
}
