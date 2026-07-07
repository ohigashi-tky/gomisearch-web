/**
 * 検索用のかな正規化ユーティリティ。
 *
 * 方針: 比較時はすべてカタカナへ寄せる。
 * - Unicode NFKC 正規化 (半角カナ→全角カナ、全角英数→半角英数 など)
 * - 英字は小文字化
 * - ひらがな (ぁ-ゖ、ゝゞ) をカタカナへ変換
 * - 前後の空白を除去
 *
 * DB には name / alias の正規化済みカラム (name_normalized / alias_normalized)
 * を保存し、検索クエリも同じ関数で正規化して LIKE 比較する。
 */
export function normalizeForSearch(input: string): string {
  const nfkc = input.normalize("NFKC").trim().toLowerCase();
  // ひらがな→カタカナ (U+3041-U+3096 ぁ-ゖ, U+309D/U+309E ゝゞ)
  return nfkc.replace(/[ぁ-ゖゝゞ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60),
  );
}

/**
 * SQL LIKE パターン用のエスケープ。ESCAPE '\' と組み合わせて使う。
 */
export function escapeLikePattern(input: string): string {
  return input.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}
