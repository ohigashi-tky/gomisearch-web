import type { WasteItem } from "../lib/types";
import { CategoryBadge } from "./CategoryBadge";

/** 検索結果の 1 行: 品目名 / 区分バッジ / 手数料 (有料時のみ) */
export function ItemRow({ item, onSelect }: { item: WasteItem; onSelect: (item: WasteItem) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        <span className="truncate text-base">{item.name}</span>
        <CategoryBadge category={item.category} />
        <span className="min-w-0 flex-1" />
        {item.fee !== null && item.fee > 0 && (
          <span className="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
            {item.fee}円
          </span>
        )}
      </button>
    </li>
  );
}
