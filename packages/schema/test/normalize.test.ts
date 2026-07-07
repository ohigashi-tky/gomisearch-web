import { describe, expect, it } from "vitest";
import { escapeLikePattern, normalizeForSearch } from "../src/normalize.js";

describe("normalizeForSearch", () => {
  it("ひらがなをカタカナに変換する", () => {
    expect(normalizeForSearch("じてんしゃ")).toBe("ジテンシャ");
    expect(normalizeForSearch("ふとん")).toBe("フトン");
  });

  it("カタカナはそのまま", () => {
    expect(normalizeForSearch("スニーカー")).toBe("スニーカー");
  });

  it("ひらがな・カタカナ混在も同一表現に揃う", () => {
    expect(normalizeForSearch("すにーかー")).toBe(
      normalizeForSearch("スニーカー"),
    );
    expect(normalizeForSearch("ペットぼとる")).toBe("ペットボトル");
  });

  it("半角カナを全角カタカナに正規化する (NFKC)", () => {
    expect(normalizeForSearch("ｽﾆｰｶｰ")).toBe("スニーカー");
  });

  it("全角英数を半角小文字に正規化する", () => {
    expect(normalizeForSearch("ＣＤ")).toBe("cd");
    expect(normalizeForSearch("PETボトル")).toBe("petボトル");
  });

  it("前後の空白を除去する", () => {
    expect(normalizeForSearch("  靴  ")).toBe("靴");
  });

  it("漢字はそのまま", () => {
    expect(normalizeForSearch("自転車")).toBe("自転車");
  });

  it("濁点付きひらがな・小書き文字も変換する", () => {
    expect(normalizeForSearch("ぱそこん")).toBe("パソコン");
    expect(normalizeForSearch("ちっちゃい")).toBe("チッチャイ");
  });
});

describe("escapeLikePattern", () => {
  it("% _ \\ をエスケープする", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
    expect(escapeLikePattern("a_b")).toBe("a\\_b");
    expect(escapeLikePattern("a\\b")).toBe("a\\\\b");
  });

  it("通常の文字列は変更しない", () => {
    expect(escapeLikePattern("ジテンシャ")).toBe("ジテンシャ");
  });
});
