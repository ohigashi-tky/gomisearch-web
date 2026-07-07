import { normalizeForSearch } from "@gomisearch/schema";

/**
 * POST /api/requests 用の簡易レートリミット。
 *
 * Workers の isolate 内メモリに保持するベストエフォート実装
 * (isolate の再起動やリージョン分散で状態は共有されないが、
 *  連投対策としてはこの範囲で十分とする)。
 *
 * - IP ごと: 60 秒間に最大 5 回
 * - IP + 同一自治体名 (正規化後): 10 分間に 1 回
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const DUPLICATE_WINDOW_MS = 10 * 60_000;

const requestTimestamps = new Map<string, number[]>();
const recentNames = new Map<string, number>();

export interface RateLimitResult {
  allowed: boolean;
  reason?: "too_many_requests" | "duplicate_request";
}

export function checkRateLimit(
  ip: string,
  municipalityName: string,
  now: number = Date.now(),
): RateLimitResult {
  const timestamps = (requestTimestamps.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );
  if (timestamps.length >= MAX_PER_WINDOW) {
    requestTimestamps.set(ip, timestamps);
    return { allowed: false, reason: "too_many_requests" };
  }

  const nameKey = `${ip}:${normalizeForSearch(municipalityName)}`;
  const lastSeen = recentNames.get(nameKey);
  if (lastSeen !== undefined && now - lastSeen < DUPLICATE_WINDOW_MS) {
    return { allowed: false, reason: "duplicate_request" };
  }

  timestamps.push(now);
  requestTimestamps.set(ip, timestamps);
  recentNames.set(nameKey, now);

  // メモリ肥大化を防ぐための軽い掃除
  if (recentNames.size > 10_000) {
    for (const [key, t] of recentNames) {
      if (now - t >= DUPLICATE_WINDOW_MS) recentNames.delete(key);
    }
  }

  return { allowed: true };
}

/** テスト用: レートリミットの状態をリセットする */
export function resetRateLimit(): void {
  requestTimestamps.clear();
  recentNames.clear();
}
