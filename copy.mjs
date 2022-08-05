// var cpy = require("cpy");
import cpy from "cpy";

async function copy() {
  await cpy(
    ["node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js"],
    "theme/dist/js/polyfill", {flat: true}
  );
}

copy();
