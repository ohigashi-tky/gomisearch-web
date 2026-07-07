import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png", "favicon.svg"],
      manifest: {
        name: "ゴミ分別検索",
        short_name: "ゴミ分別検索",
        description: "品目名で検索すると自治体ごとのゴミの捨て方が即答される",
        lang: "ja",
        start_url: "/",
        display: "standalone",
        theme_color: "#2E7D5B",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // アプリシェルをプリキャッシュしてオフライン起動可能にする。
        // データは IndexedDB 側で持つため API は Service Worker でキャッシュしない
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
