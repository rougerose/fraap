import modular from "modujs";
import * as modules from "./modules";
import smoothscroll from "smoothscroll-polyfill";
// import { html } from "./util/environment";
// import { getModuleNames, addActiveModule } from "./util/module";
// import Dialog from "./dialog";

const fraap = new modular({
  modules: modules,
});

smoothscroll.polyfill();

fraap.init(fraap);

// let dialogs = html.querySelectorAll("[data-module-dialog]");
// let i = 1;
// let activeModules = "";

// for (const dialog of dialogs) {
//   let moduleNames = getModuleNames(dialog);
//   // Récupérer le nom du module et éventuellement son type
//   const options = {
//     el: dialog,
//     moduleName: moduleNames.moduleName,
//     dataName: moduleNames.dataName,
//     typeName: moduleNames.typeName,
//   };

//   // Attribuer un identifiant au module
//   let moduleAttr = "data-module-" + options.moduleName;
//   let id = dialog.getAttribute("data-module-" + options.moduleName);
//   if (!id) {
//     id = "module" + i;
//     dialog.setAttribute(moduleAttr, id);
//   }

//   //
//   // const module = new moduleNames.moduleName(options)
// }
