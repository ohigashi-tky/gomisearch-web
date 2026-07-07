import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage as describeError, searchMunicipalities } from "../lib/api";
import type { Municipality } from "../lib/types";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { BuildingIcon, ChevronLeftIcon } from "./Icons";
import { Spinner } from "./Spinner";

interface Props {
  onSelect: (municipality: Municipality) => void;
  /** 検索画面からの自治体変更として開いた場合の戻る操作 */
  onClose?: () => void;
}

/** 自治体選択画面 (初回アクセス時・自治体変更時) */
export function MunicipalitySelectionView({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Municipality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // インクリメンタル検索 (debounce 200ms)
  const debouncedQuery = useDebouncedValue(query, 200);

  const search = useCallback(async (rawQuery: string) => {
    abortRef.current?.abort();
    const trimmed = rawQuery.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setHasSearched(false);
      setErrorMessage(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const municipalities = await searchMunicipalities(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      setResults(municipalities);
      setHasSearched(true);
    } catch (error) {
      // 次の検索に置き換えられた場合は何もしない
      if (controller.signal.aborted) return;
      setResults([]);
      setHasSearched(true);
      setErrorMessage(describeError(error));
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void search(debouncedQuery);
  }, [debouncedQuery, search]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="relative flex h-12 items-center justify-center">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute left-2 flex items-center gap-0.5 p-2 text-accent"
              aria-label="検索画面に戻る"
            >
              <ChevronLeftIcon className="size-5" />
              <span className="text-sm">戻る</span>
            </button>
          )}
          <h1 className="text-base font-semibold">自治体を選択</h1>
        </div>
        <div className="px-4 pb-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="自治体名で検索"
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
    if (query.trim().length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400">
          <BuildingIcon className="size-10" />
          <p className="text-sm">自治体名で検索</p>
        </div>
      );
    }
    if (isLoading && results.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (errorMessage) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{errorMessage}</p>
          <button type="button" onClick={() => void search(query)} className="text-sm text-accent">
            再試行
          </button>
        </div>
      );
    }
    if (results.length === 0 && hasSearched) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">見つかりませんでした</p>
        </div>
      );
    }
    return (
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {results.map((municipality) => (
          <li key={municipality.id}>
            <button
              type="button"
              onClick={() => onSelect(municipality)}
              className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <span className="text-base">{municipality.name}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {municipality.prefecture}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
