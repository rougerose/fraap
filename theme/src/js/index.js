import modular from "modujs";
import * as modules from "./modules";
import smoothscroll from "smoothscroll-polyfill";

const fraap = new modular({
  modules: modules,
});

init();

function init() {
  smoothscroll.polyfill();
  fraap.init(fraap);
}
