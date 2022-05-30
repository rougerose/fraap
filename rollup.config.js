import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "focus-visible/src/focus-visible.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/polyfill/focus-visible.js",
        format: "umd",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
  {
    input: "theme/src/js/index.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap.js",
        format: "iife",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
];
