import fraapCollapsible from "./fraap-collapsible";
import { findOne } from "./util/findOne";

let filtres_mediatheque = document.querySelector(".formulaire_mediatheque_filtres");

if (filtres_mediatheque) {
  // form element
  let form_filtres_mediatheque = filtres_mediatheque.querySelector("form"),
    form_filtres_mediatheque_inputs_array = Array.from(filtres_mediatheque.querySelectorAll("input"));

  // init du dialog
  const dialogs = new WeakMap();
  const openDialogs = [];
  let dialogEl = document.querySelector("#dialogFiltres"), options = { allowTouchMove: () => true };

  if (dialogEl) {
    var dialogFiltres = new Fraap.FraapDialog(dialogEl, options);
    dialogs.set(dialogEl, dialogFiltres);

    //dialogFiltres.on("show", (event) => { console.log(event) });

    // dialogFiltres.on('show', function (dialogEl) {
    //   const dialog = dialogs.get(dialogEl)
    //   // Store that the dialog is the new open dialog
    //   openDialogs.push(dialog)
    //   // TODO: Use the `destroy` and `hide` events
    //   // to make sure `openDialogs` doesn't leak
    // });
    console.log(dialogFiltres);
  }

  // init des accordéons
  fraapCollapsible.init(form_filtres_mediatheque, true);

  // délégation de l'événement change sur les boutons radio et cases à cocher.
  document.addEventListener("input", (event) => {
    let target = event.target;
    //console.log(event, target);
    //console.log([target]);
    if (findOne([target], form_filtres_mediatheque_inputs_array)) {
      console.log(target.form);
      // form_filtres_mediatheque.submit();
      ajaxReload("filtres", {});
      console.log(dialogFiltres);
    };
  });

  // console.log(form_filtres_mediatheque_inputs);
}
