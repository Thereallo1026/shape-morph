import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    target: "es2022",
    tsconfig: "tsconfig.json",
  },
  {
    entry: {
      "react/index": "src/react/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    target: "es2022",
    external: ["react"],
    tsconfig: "tsconfig.json",
  },
]);
