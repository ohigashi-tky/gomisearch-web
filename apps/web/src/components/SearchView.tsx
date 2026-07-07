import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { errorMessage as describeError, requestMunicipality } from "../lib/api";
import { ItemsSyncService } from "../lib/itemsSync";
import { LocalSearchEngine } from "../lib/searchEngine";
import type { Municipality, WasteItem } from "../lib/types";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ChevronDownIcon, MagnifyingGlassIcon, TrayIcon } from "./Icons";
import { ItemDetailView } from "./ItemDetailView";
import { ItemRow } from "./ItemRow";
import { MunicipalitySelectionView } from "./MunicipalitySelectionView";
import { Spinner } from "./Spinner";

type LoadState =
  | { kind: "loading" }
  /** 品目キャッシュ読み込み済み */
  | { kind: "ready" }
  /** 選んだ自治体がデータ未整備 (品目0件) */
  | { kind: "unsupported" }
  | { kind: "failed"; message: string };

interface Props {
  municipality: Municipality;
  onChangeMunicipality: (municipality: Municipality) => void;
}

/**
 * ホーム (検索) 画面。起動時に品目キャッシュを読み込み (ETag 差分チェック付き)、
 * 以降の検索はローカルキャッシュに対して行う (オフラインでも検索可能)。
 */
export function SearchView({ municipality, onChangeMunicipality }: Props) {
  const syncService = useMemo(() => new ItemsSyncService(), []);
  const engineRef = useRef<LocalSearchEngine>(new LocalSearchEngine([]));

  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WasteItem[]>([]);
  const [suggestionItems, setSuggestionItems] = useState<WasteItem[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = useState<string | null>(null);

  // 詳細 / 自治体選択は履歴エントリを積み、ブラウザの戻るで閉じられるようにする
  const [detailItem, setDetailItem] = useState<WasteItem | null>(null);
  const [showsPicker, setShowsPicker] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  // インクリメンタル検索 (debounce 200ms)
  const debouncedQuery = useDebouncedValue(query, 200);

  /** 品目キャッシュの読み込み (起動時 / 再試行時) */
  const load = useCallback(async () => {
    setLoadState({ kind: "loading" });
    try {
      const response = await syncService.loadItems(municipality.id);
      engineRef.current = new LocalSearchEngine(response.items);
      setLoadState(engineRef.current.isEmpty ? { kind: "unsupported" } : { kind: "ready" });
    } catch (error) {
      setLoadState({ kind: "failed", message: describeError(error) });
    }
  }, [municipality.id, syncService]);

  useEffect(() => {
    void load();
  }, [load]);

  // 起動時に検索バーへフォーカス
  useEffect(() => {
    if (loadState.kind === "ready") {
      searchInputRef.current?.focus();
    }
  }, [loadState.kind]);

  // 現在の query でローカル検索を実行する
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setSuggestionItems([]);
      return;
    }
    const hits = engineRef.current.search(trimmed);
    setResults(hits);
    setSuggestionItems(hits.length === 0 ? engineRef.current.suggestions(trimmed) : []);
  }, [debouncedQuery, loadState]);

  useEffect(() => {
    const onPopState = () => {
      setDetailItem(null);
      setShowsPicker(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openDetail = (item: WasteItem) => {
    history.pushState({ overlay: "detail" }, "");
    setDetailItem(item);
  };

  const openPicker = () => {
    history.pushState({ overlay: "picker" }, "");
    setShowsPicker(true);
  };

  /** 未対応自治体の対応リクエストを送信する */
  const sendSupportRequest = async () => {
    setRequestErrorMessage(null);
    try {
      await requestMunicipality(municipality.name);
      setRequestSent(true);
    } catch (error) {
      setRequestErrorMessage(describeError(error));
    }
  };

  if (showsPicker) {
    return (
      <MunicipalitySelectionView
        onClose={() => history.back()}
        onSelect={(selected) => {
          history.back();
          onChangeMunicipality(selected);
        }}
      />
    );
  }

  if (detailItem) {
    return (
      <ItemDetailView item={detailItem} municipality={municipality} onBack={() => history.back()} />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex h-12 items-center justify-center">
          {/* ヘッダーに現在の自治体名。タップで自治体変更画面へ */}
          <button
            type="button"
            onClick={openPicker}
            className="flex items-center gap-1 p-2"
            aria-label={`自治体を変更: 現在は${municipality.name}`}
          >
            <span className="text-base font-semibold">{municipality.name}</span>
            <ChevronDownIcon className="size-3.5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="品目名で検索"
            enterKeyHint="search"
            autoComplete="off"
            className="w-full rounded-lg bg-neutral-100 px-3 py-2 text-base outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-accent dark:bg-neutral-900 dark:placeholder:text-neutral-500"
          />
        </div>
      </header>

      <main className="flex flex-1 flex-col">{renderContent()}</main>
    </div>
  );

  function renderContent() {
    switch (loadState.kind) {
      case "loading":
        return (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4">
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              {loadState.message}
            </p>
            <button type="button" onClick={() => void load()} className="text-sm text-accent">
              再読み込み
            </button>
          </div>
        );
      case "unsupported":
        return (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-neutral-500 dark:text-neutral-400">
            <TrayIcon className="size-10" />
            <p className="text-sm">この自治体はまだ対応していません</p>
            {requestSent ? (
              <p className="text-xs">対応リクエストを送信しました</p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => void sendSupportRequest()}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  対応リクエストを送信
                </button>
                {requestErrorMessage && <p className="text-xs">{requestErrorMessage}</p>}
              </>
            )}
          </div>
        );
      case "ready":
        return renderReadyContent();
    }
  }

  function renderReadyContent() {
    if (query.trim().length === 0) {
      // 空状態: アイコン1個 + 一言のみ
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400">
          <MagnifyingGlassIcon className="size-10" />
          <p className="text-sm">品目名で検索</p>
        </div>
      );
    }
    if (results.length > 0) {
      return (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {results.map((item) => (
            <ItemRow key={item.id} item={item} onSelect={openDetail} />
          ))}
        </ul>
      );
    }
    if (suggestionItems.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">見つかりませんでした</p>
        </div>
      );
    }
    // 0件時のゆるい候補をタップ可能なリストで提示する
    return (
      <div>
        <p className="border-b border-neutral-200 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          見つかりませんでした — もしかして
        </p>
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {suggestionItems.map((item) => (
            <ItemRow key={item.id} item={item} onSelect={openDetail} />
          ))}
        </ul>
      </div>
    );
  }
}
