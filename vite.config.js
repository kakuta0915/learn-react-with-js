import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    // 🔥 下記の関数をviteで自動コンパイル
    jsxFactory: "MyReact.createElement",
  },
});
