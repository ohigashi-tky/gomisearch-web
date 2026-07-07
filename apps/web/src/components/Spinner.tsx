export function Spinner() {
  return (
    <div
      className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-700 dark:border-t-neutral-300"
      role="status"
      aria-label="読み込み中"
    />
  );
}
