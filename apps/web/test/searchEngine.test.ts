import { beforeEach, describe, expect, it } from "vitest";
import { LocalSearchEngine } from "../src/lib/searchEngine";
import { sampleItems } from "./sampleItems";

// iOS 版 LocalSearchEngineTests と同じテストケース・期待値
describe("LocalSearchEngine", () => {
  let engine: LocalSearchEngine;

  beforeEach(() => {
    engine = new LocalSearchEngine(sampleItems);
  });

  describe("ヒット", () => {
    it("スニーカー (別名) で靴がヒットする", () => {
      expect(engine.search("スニーカー").map((item) => item.name)).toEqual(["靴"]);
    });

    it("レンジ (部分一致) で電子レンジがヒットする", () => {
      expect(engine.search("レンジ").map((item) => item.name)).toContain("電子レンジ");
    });
  });

  describe("かな正規化", () => {
    it("じてんしゃで自転車がヒットする (粗大ごみ・400円・申請URLあり)", () => {
      const results = engine.search("じてんしゃ");
      const bicycle = results.find((item) => item.name === "自転車");
      expect(bicycle).toBeDefined();
      expect(bicycle?.category).toBe("粗大ごみ");
      expect(bicycle?.fee).toBe(400);
      expect(bicycle?.applyUrl).not.toBeNull();
    });

    it("ひらがなとカタカナで同じ結果になる", () => {
      const hiragana = engine.search("ふとん");
      const katakana = engine.search("フトン");
      expect(hiragana.length).toBeGreaterThan(0);
      expect(hiragana).toEqual(katakana);
      expect(hiragana[0]?.name).toBe("布団");
    });

    it("半角カナでもヒットする", () => {
      expect(engine.search("ｽﾆｰｶｰ").map((item) => item.name)).toEqual(["靴"]);
    });

    it("前後の空白は無視される", () => {
      expect(engine.search("  スニーカー  ").map((item) => item.name)).toEqual(["靴"]);
    });
  });

  describe("0件時", () => {
    it("一致しなければ空を返す", () => {
      expect(engine.search("存在しない品目xyz")).toEqual([]);
    });

    it("前方一致のゆるい候補を返す", () => {
      // 「じてんしゃぶ」は部分一致では0件だが、前方一致の候補として自転車が出る
      expect(engine.search("じてんしゃぶ")).toEqual([]);
      const suggestions = engine.suggestions("じてんしゃぶ");
      expect(suggestions.map((item) => item.name)).toContain("自転車");
    });

    it("まったく一致しなければ候補も空", () => {
      expect(engine.suggestions("qqqqzzzz")).toEqual([]);
    });

    it("候補は limit を超えない", () => {
      expect(engine.suggestions("て", 2).length).toBeLessThanOrEqual(2);
    });
  });

  describe("空クエリ", () => {
    it("空・空白のみのクエリは空を返す", () => {
      expect(engine.search("")).toEqual([]);
      expect(engine.search("   ")).toEqual([]);
      expect(engine.suggestions("")).toEqual([]);
    });
  });

  describe("エンジンの状態", () => {
    it("isEmpty / itemCount が品目数を反映する", () => {
      expect(engine.isEmpty).toBe(false);
      expect(engine.itemCount).toBe(sampleItems.length);
      const empty = new LocalSearchEngine([]);
      expect(empty.isEmpty).toBe(true);
      expect(empty.itemCount).toBe(0);
    });
  });
});
