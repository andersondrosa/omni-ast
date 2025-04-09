import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from "./package.json" assert { type: "json" };
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

const external = Object.keys(packageJson.peerDependencies || {});

const buildJS = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js", // CommonJS
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.mjs", // ESM
      format: "esm",
      sourcemap: true,
    },
  ],
  external: (path) => {
    const [dep] = path.split("/");
    if (external.includes(dep)) return true;
    return external.includes(path);
  },
  plugins: [
    terser({
      format: { comments: false, beautify: false },
      compress: true, // Desativa a compressão do código
      mangle: true, // Evita mudança nos nomes das variáveis
    }),
    resolve({
      preferBuiltins: false, // Prefere scripts embutidos
    }),
    json(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.esm.json", declaration: false }),
  ],
};

const buildDTS = {
  input: "src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()],
};

export default [buildJS, buildDTS];
