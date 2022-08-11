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
        name: "fraapDialogMembers",
        exports: "default",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
  {
    input: "theme/src/js/fraap-carousel.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-carousel.js",
        format: "iife",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
  {
    input: "theme/src/js/fraap-members.js",
    external: ["jQuery"],
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-members.js",
        format: "iife",
        name: "FraapMembers",
        exports: "default",
        globals: { jQuery: "$" },
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
  {
    input: "theme/src/js/fraap-collapsible.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-collapsible.js",
        format: "umd",
        name: "fraapCollapsible",
        exports: "default",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
  {
    input: "theme/src/js/fraap-scrollspy.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-scrollspy.js",
        format: "iife",
        name: "fraapCollapsible",
        plugins: [process.env.NODE_ENV === "production" && terser()],
      },
    ],
  },
];
