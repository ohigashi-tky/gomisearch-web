/**
 * レスポンスボディ文字列から強い ETag を計算する (SHA-1 の hex)。
 */
export async function computeEtag(body: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(body),
  );
  const hex = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `"${hex}"`;
}

/**
 * If-None-Match ヘッダと ETag の比較。弱い比較 (W/ プレフィックスを無視) を行う。
 */
export function etagMatches(ifNoneMatch: string | undefined, etag: string): boolean {
  if (!ifNoneMatch) return false;
  const strip = (v: string) => v.trim().replace(/^W\//, "");
  return ifNoneMatch
    .split(",")
    .some((candidate) => candidate.trim() === "*" || strip(candidate) === strip(etag));
}
