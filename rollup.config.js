import { terser } from "rollup-plugin-terser";
// import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "theme/src/js/index.js",
  output: [
    {
      file: "theme/dist/js/fraap.js",
      format: "iife",
      name: "fraap",
      plugins: [
        // nodeResolve(),
        process.env.NODE_ENV === "production" && terser(),
      ],
    },
    {
      file: "theme/dist/js/fraap.mod.js",
      format: "es",
      plugins: [
        // nodeResolve(),
        process.env.NODE_ENV === "production" && terser(),
      ],
    },
  ],
};
