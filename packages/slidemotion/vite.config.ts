import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { copyFileSync } from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "tsconfig.build.json",
      rollupTypes: false,
    }),
    {
      name: "copy-styles",
      closeBundle() {
        copyFileSync(resolve(__dirname, "styles.css"), resolve(__dirname, "dist/styles.css"));
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "theme/index": resolve(__dirname, "src/theme/index.ts"),
        "animation/index": resolve(__dirname, "src/animation/index.ts"),
        "code/index": resolve(__dirname, "src/code/index.ts"),
        "presenter/index": resolve(__dirname, "src/presenter/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react-dom/client",
        /^shiki/,
        /^shiki-magic-move/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    target: "es2022",
    minify: false,
    sourcemap: true,
  },
});
