import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ include: ["lib"], outDir: "dist/types" })],
  build: {
    copyPublicDir: true,
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: "rx-pdf-viewer",
      fileName: (format) => `rx-pdf-viewer.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
