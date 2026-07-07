import type { ItemsFetchResult, Municipality, MunicipalityItemsResponse } from "./types";

export type ApiErrorKind = "invalidResponse" | "server" | "network" | "decoding";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly statusCode?: number;

  constructor(kind: ApiErrorKind, statusCode?: number) {
    super(describe(kind, statusCode));
    this.name = "ApiError";
    this.kind = kind;
    this.statusCode = statusCode;
  }
}

function describe(kind: ApiErrorKind, statusCode?: number): string {
  switch (kind) {
    case "invalidResponse":
      return "サーバの応答が不正です";
    case "server":
      return `サーバエラー (HTTP ${statusCode})`;
    case "network":
      return "通信に失敗しました。接続を確認してください";
    case "decoding":
      return "データの読み込みに失敗しました";
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "読み込みに失敗しました";
}

async function perform(path: string, init?: RequestInit): Promise<Response> {
  try {
    // ETag の 304 判定を自前で行うため HTTP キャッシュを挟まない
    return await fetch(path, { cache: "no-store", ...init });
  } catch (error) {
    // 中断 (次の検索への置き換え) はネットワークエラー扱いにしない
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("network");
  }
}

async function decode<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("decoding");
  }
}

/** docs/api-spec.md の API を叩く薄い HTTP クライアント (同一オリジンの /api) */
export async function searchMunicipalities(
  query: string,
  signal?: AbortSignal,
): Promise<Municipality[]> {
  const params = new URLSearchParams({ q: query });
  const response = await perform(`/api/municipalities?${params}`, { signal });
  if (!response.ok) {
    throw new ApiError("server", response.status);
  }
  const body = await decode<{ municipalities: Municipality[] }>(response);
  return body.municipalities;
}

/** ETag 付きの品目一括取得。etag が最新なら notModified を返す */
export async function fetchItems(
  municipalityId: number,
  etag: string | null,
): Promise<ItemsFetchResult> {
  const headers: HeadersInit = etag ? { "If-None-Match": etag } : {};
  const response = await perform(`/api/municipalities/${municipalityId}/items`, { headers });
  if (response.status === 304) {
    return { kind: "notModified" };
  }
  if (response.status === 200) {
    const body = await decode<MunicipalityItemsResponse>(response);
    return { kind: "updated", response: body, etag: response.headers.get("ETag") };
  }
  throw new ApiError("server", response.status);
}

/** POST /api/requests: 未対応自治体の対応リクエストを送信する */
export async function requestMunicipality(name: string): Promise<void> {
  const response = await perform("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ municipalityName: name }),
  });
  if (!response.ok) {
    throw new ApiError("server", response.status);
  }
}
