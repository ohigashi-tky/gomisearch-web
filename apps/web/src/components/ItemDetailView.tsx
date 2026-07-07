import type { Municipality, WasteItem } from "../lib/types";
import { ArrowTopRightOnSquareIcon, ChevronLeftIcon } from "./Icons";
import { CategoryBadge } from "./CategoryBadge";

interface Props {
  item: WasteItem;
  municipality: Municipality;
  onBack: () => void;
}

/** 品目詳細画面 */
export function ItemDetailView({ item, municipality, onBack }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative flex h-12 items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-2 flex items-center gap-0.5 p-2 text-accent"
          aria-label="検索画面に戻る"
        >
          <ChevronLeftIcon className="size-5" />
          <span className="text-sm">戻る</span>
        </button>
      </header>

      <main className="flex flex-col gap-5 px-5 py-4">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl font-bold">{item.name}</h1>
          <CategoryBadge category={item.category} />
        </div>

        {item.fee !== null && item.fee > 0 && (
          <section>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">手数料</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{item.fee}円</p>
          </section>
        )}

        <hr className="border-neutral-200 dark:border-neutral-800" />

        <section>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">出し方</p>
          <p className="mt-1.5 text-sm leading-relaxed">{item.instructions}</p>
        </section>

        {(item.applyUrl || municipality.sourceUrl) && (
          <>
            <hr className="border-neutral-200 dark:border-neutral-800" />
            <section className="flex flex-col items-start gap-3">
              {item.applyUrl && (
                <a
                  href={item.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-accent"
                >
                  <ArrowTopRightOnSquareIcon className="size-4" />
                  収集を申し込む
                </a>
              )}
              {municipality.sourceUrl && (
                <a
                  href={municipality.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-accent"
                >
                  <ArrowTopRightOnSquareIcon className="size-4" />
                  出典 ({municipality.name})
                </a>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
