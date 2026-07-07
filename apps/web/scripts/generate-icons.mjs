// PWA アイコンを public/ に生成する (実行: pnpm --filter @gomisearch/web icons:generate)
// テーマカラー #2E7D5B の背景 + 白のごみ箱アウトライン (Heroicons trash)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "..", "public");
const iconsDir = path.join(publicDir, "icons");

const TRASH_PATH =
  "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0";

/**
 * - rounded: 通常アイコン用の角丸 (ホーム画面でそのまま表示される環境向け)
 * - maskable はセーフゾーン確保のためグリフを小さめに描く
 */
function iconSvg({ size, rounded, glyphScale }) {
  const radius = rounded ? Math.round(size * 0.2) : 0;
  const glyphSize = Math.round(size * glyphScale);
  const offset = Math.round((size - glyphSize) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#2E7D5B"/>
  <svg x="${offset}" y="${offset}" width="${glyphSize}" height="${glyphSize}" viewBox="0 0 24 24" fill="none">
    <path d="${TRASH_PATH}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</svg>`;
}

async function render(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(file);
  console.log(`generated ${path.relative(publicDir, file)}`);
}

await mkdir(iconsDir, { recursive: true });

await render(iconSvg({ size: 192, rounded: true, glyphScale: 0.55 }), path.join(iconsDir, "icon-192.png"));
await render(iconSvg({ size: 512, rounded: true, glyphScale: 0.55 }), path.join(iconsDir, "icon-512.png"));
await render(iconSvg({ size: 512, rounded: false, glyphScale: 0.45 }), path.join(iconsDir, "maskable-512.png"));
// iOS Safari の「ホーム画面に追加」用 (iOS 側で角丸が付くので rounded なし)
await render(iconSvg({ size: 180, rounded: false, glyphScale: 0.55 }), path.join(iconsDir, "apple-touch-icon.png"));

await writeFile(path.join(publicDir, "favicon.svg"), iconSvg({ size: 64, rounded: true, glyphScale: 0.6 }));
console.log("generated favicon.svg");
