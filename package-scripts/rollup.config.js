import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const terserOpts = {
  compress: { passes: 3 },
  module: true,
  mangle: true,
  nameCache: {},
};

const outputPlugins = () => [
  process.env.NODE_ENV === "production" && terser(terserOpts),
];

export default [
  {
    input: "theme/src/js/index.js",
    plugins: [resolve(), commonjs()],
    output: {
      file: "theme/dist/js/fraap.js",
      format: "iife",
      plugins: outputPlugins(),
    },
  },
  {
    input: "theme/src/js/fraap-carousel.js",
    plugins: [resolve()],
    output: {
      file: "theme/dist/js/fraap-carousel.js",
      format: "iife",
      plugins: outputPlugins(),
    },
  },
  {
    input: "theme/src/js/members.js",
    plugins: [resolve()],
    external: ["jQuery"],
    output: {
      file: "theme/dist/js/fraapmembers.js",
      format: "iife",
      plugins: outputPlugins(),
      globals: { jQuery: "$" },
    },
  },
  {
    input: "theme/src/js/fraap-scrollspy.js",
    plugins: [resolve(), commonjs()],
    output: {
      file: "theme/dist/js/fraap-scrollspy.js",
      format: "es",
      plugins: outputPlugins(),
    },
  },
  {
    input: "theme/src/js/fraap-compteur-reseau.js",
    output: {
      file: "theme/dist/js/fraap-compteur-reseau.js",
      format: "iife",
      plugins: outputPlugins(),
    },
  },
  {
    input: "theme/src/js/fraap-compteur-ressources.js",
    output: {
      file: "theme/dist/js/fraap-compteur-ressources.js",
      format: "iife",
      plugins: outputPlugins(),
    },
  },
];
