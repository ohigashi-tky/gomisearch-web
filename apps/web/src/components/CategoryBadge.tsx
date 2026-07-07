/**
 * 分別区分バッジ。彩度を抑えたトーンで統一する (iOS 版 CategoryBadge と同じ配色)。
 * - 粗大ごみ: 落ち着いた赤 / 普通ごみ: グレー / 資源: 深緑 /
 *   容器包装プラスチック: 彩度を抑えた青 / 古紙・衣類: 彩度を抑えた茶 /
 *   収集不可: 黒 (ダークモードでは反転)
 */
const BADGE_STYLES: Record<string, string> = {
  粗大ごみ: "bg-[#C0392B] text-white",
  普通ごみ: "bg-[#8E8E93] text-white",
  資源: "bg-accent text-white",
  容器包装プラスチック: "bg-[#3A7CA5] text-white",
  "古紙・衣類": "bg-[#8C6D46] text-white",
  収集不可: "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950",
};

const UNKNOWN_STYLE = "bg-[#AEAEB2] text-white";

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ${
        BADGE_STYLES[category] ?? UNKNOWN_STYLE
      }`}
    >
      {category}
    </span>
  );
}
