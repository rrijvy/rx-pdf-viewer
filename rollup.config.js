import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import ignore from "rollup-plugin-ignore";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: [".mjs", ".js", ".json", ".node", ".ts"],
        preferBuiltins: true,
        browser: true,
      }),
      commonjs({
        include: /node_modules/,
        extensions: [".js", ".cjs"],
      }),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      ignore(["**/*.node"]),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ dir: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
