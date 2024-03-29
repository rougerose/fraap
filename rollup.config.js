import { terser } from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";

var output_plugins = [
  process.env.NODE_ENV === "production" && terser(),
  filesize(),
];

export default [
  // polyfill focus-visible
  {
    input: "focus-visible/src/focus-visible.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/polyfill/focus-visible.js",
        format: "umd",
        plugins: output_plugins,
      },
    ],
  },
  // Fraap.js : export variable globale Fraap
  // Dialog
  {
    input: "theme/src/js/index.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap.js",
        format: "iife",
        name: "Fraap",
        exports: "named",
        plugins: output_plugins,
      },
    ],
  },
  // Carousel
  {
    input: "theme/src/js/fraap-carousel.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-carousel.js",
        format: "iife",
        plugins: output_plugins,
      },
    ],
  },
  // Carte de l'annuaire
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
        plugins: output_plugins,
      },
    ],
  },
  // Init Carte et Dialog de l'annuaire
  {
    input: "theme/src/js/fraap-members-init.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-members-init.js",
        format: "es",
        plugins: output_plugins,
      },
    ],
  },
  // Init Dialog Filtres
  {
    input: "theme/src/js/fraap-dialog-filtres-init.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-dialog-filtres-init.js",
        format: "iife",
        plugins: output_plugins,
      },
    ],
  },
  // Accordéons
  {
    input: "theme/src/js/fraap-collapsible.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-collapsible.js",
        format: "iife",
        name: "fraapCollapsible",
        exports: "default",
        plugins: output_plugins,
      },
    ],
  },
  // Sommaire des articles
  {
    input: "theme/src/js/fraap-scrollspy.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-scrollspy.js",
        format: "iife",
        name: "fraapCollapsible",
        plugins: output_plugins,
      },
    ],
  },
  // Teaser Réseau : animation du compteur
  {
    input: "theme/src/js/fraap-compteur-reseau.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-compteur-reseau.js",
        format: "iife",
        plugins: output_plugins,
      },
    ],
  },
  // Teasers Ressources : animation des compteurs
  {
    input: "theme/src/js/fraap-compteur-ressources.js",
    plugins: [nodeResolve(), commonjs()],
    output: [
      {
        file: "theme/dist/js/fraap-compteur-ressources.js",
        format: "iife",
        plugins: output_plugins,
      },
    ],
  },
];
