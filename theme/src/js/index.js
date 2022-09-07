import FraapDialog from "./fraap-dialog";
import fraapMenu from "./fraap-main-menu";

let dialogs = [
  ["dialogRecherche", {}],
  ["siteNavOffcanvas", { allowTouchMove: () => true }],
];

dialogs.forEach((dialog) => {
  let id = dialog[0],
    options = dialog[1];

  let dialogEl = document.querySelector("#" + id);
  if (dialogEl) {
    if (id == "siteNavOffcanvas") {
      // Activer les raccourcis avant l'instance Dialog
      fraapMenu.init();
    }
    let dialogInstance = new FraapDialog(dialogEl, options);
  }
});

export {FraapDialog};
