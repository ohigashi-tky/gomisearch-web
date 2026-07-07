import type { Municipality } from "./types";

/** 選択中の自治体を localStorage に保存する (初回アクセス時の選択を次回以降スキップ) */
const KEY = "selectedMunicipality";

export function loadSelectedMunicipality(): Municipality | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Municipality;
    return typeof parsed?.id === "number" && typeof parsed?.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSelectedMunicipality(municipality: Municipality): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(municipality));
  } catch {
    // プライベートモード等で保存できない場合は選択がセッション限りになるだけ
  }
}

export function clearSelectedMunicipality(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 何もしない
  }
}
