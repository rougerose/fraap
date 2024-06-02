import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const terserOptions = {
  compress: { passes: 3 },
  module: true,
  mangle: true,
  nameCache: {},
};
const outputPlugins = () => [
  process.env.NODE_ENV === "production" && terser(terserOptions),
  process.env.NODE_ENV === "test" && terser(terserOptions),
];

function build(
  src,
  dist,
  format = "es",
  name = "",
  exports = "auto",
  globals = undefined,
  external = undefined
) {
  return {
    input: src,
    external: external,
    plugins: [resolve(), commonjs()],
    output: {
      file: dist,
      format: format,
      name: name,
      exports: exports,
      globals: globals,
      plugins: outputPlugins(),
    },
  };
}

export default [
  // fraap.js : export variable globale "FraapDialog"
  build("theme/src/js/index.js", "theme/dist/js/fraap.js"),
  // carousel
  build(
    "theme/src/js/fraap-carousel.js",
    "theme/dist/js/fraap-carousel.js",
    "iife"
  ),

  // annuaire membres : carte GIS
  build(
    "theme/src/js/fraap-members.js",
    "theme/dist/js/fraap-members.js",
    "iife",
    "FraapMembers",
    "default",
    { jQuery: "$" },
    ["jQuery"]
  ),

  // Annuaire : init de la carte et de l'annuaire
  build(
    "theme/src/js/fraap-members-init.js",
    "theme/dist/js/fraap-members-init.js"
  ),

  // Init Dialog Filtres
  build(
    "theme/src/js/fraap-dialog-filtres-init.js",
    "theme/dist/js/fraap-dialog-filtres-init.js",
    "iife"
  ),

  // Accordéons
  // build(
  //   "theme/src/js/fraap-collapsible.js",
  //   "theme/dist/js/fraap-collapsible.js",
  //   "iife",
  //   "fraapCollapsible",
  //   "default"
  // ),
  // build(
  //   "theme/src/js/fraap-collapsible.js",
  //   "theme/dist/js/fraap-collapsible.js"
  // ),

  // Médiathèque
  build(
    "theme/src/js/fraap-mediatheque.js",
    "theme/dist/js/fraap-mediatheque.js"
  ),

  // Sommaire des articles : activer l'élément dans la vue
  build("theme/src/js/fraap-scrollspy.js", "theme/dist/js/fraap-scrollspy.js"),

  // Compteur membres Fraap
  build(
    "theme/src/js/fraap-compteur-reseau.js",
    "theme/dist/js/fraap-compteur-reseau.js",
    "iife"
  ),

  // Animation des compteurs
  build(
    "theme/src/js/fraap-compteur-ressources.js",
    "theme/dist/js/fraap-compteur-ressources.js",
    "iife"
  ),
];
