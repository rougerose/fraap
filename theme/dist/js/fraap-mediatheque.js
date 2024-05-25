/**
 * Collapsible (accordion)
 * Source https://inclusive-components.design/collapsible-sections/
 * @param {bool} trackHeadings - Reporter dans un champ hidden l'identifiant du bouton ouvert. Utile lorsque l'accordéon est utilisé dans un formulaire.
 */
const collapsibleInit = (container, extend) => {
  // L'accordéon est utilisé dans un formulaire,
  // des fonctionnalités supplémentaires sont nécessaires.
  const extendMode = extend || false;
  const headings = container.querySelectorAll(".collapsible_heading");

  if (headings.length > 0) {
    headings.forEach((heading) => {
      let btn = heading.firstElementChild,
        target = heading.nextElementSibling,
        inputs,
        expanded = false;

      // Ajouter au bouton les labels des filtres déjà cochés
      if (extendMode) {
        inputs = heading.nextElementSibling.querySelectorAll(
          "input:checked"
        );

        expanded = btn.getAttribute("aria-expanded") === "true" || false;

        // Afficher la sélection
        if (expanded === false && inputs.length > 0) {
          addUserChoice(btn, inputs);
        }
      }

      btn.onclick = () => {
        expanded = btn.getAttribute("aria-expanded") === "true" || false;
        btn.setAttribute("aria-expanded", !expanded);
        // Modifier l'état hidden/visible du bloc
        target.hidden = expanded;

        if (extendMode) {
          // Supprimer le span.collapsible_user-choice s'il existe
          let userChoice = btn.querySelector("span.collapsible_user-choice");
          if (userChoice) {
            userChoice.parentNode.removeChild(userChoice);
          }

          // Afficher le choix de l'utilisateur à la fermeture du bouton
          inputs = heading.nextElementSibling.querySelectorAll(
            "input:checked"
          );
          if (expanded === true && inputs.length > 0) {
            addUserChoice(btn, inputs);
          }

          let hiddenInput = btn.nextElementSibling;

          if (!expanded) {
            hiddenInput.setAttribute("value", btn.id);
          } else {
            hiddenInput.setAttribute("value", "");
          }
        }
      };
    });
  }
};

/**
 * Ajouter sur le bouton les choix de l'utilisateur
 *
 * @param {node} btn Élément parent
 * @param {nodeList} inputs Les sélections de l'utilisateur
 */
const addUserChoice = (btn, inputs) => {
  let labels = [];
  inputs.forEach((input) => {
    labels.push(input.dataset.label);
  });

  if (labels.length > 0) {
    let span = document.createElement("span"),
      userChoice = document.createTextNode(labels.join(", "));

    span.appendChild(userChoice);
    span.classList.add("collapsible_user-choice");
    btn.firstElementChild.appendChild(span);
  }
};

const fraapCollapsible = {
  init: collapsibleInit,
};

/**
 * @description determine if an array contains one or more items from another array.
 * @link https://stackoverflow.com/a/25926600
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
const findOne = (haystack, arr) => {
    return arr.some(v => haystack.includes(v));
};

let filtres_mediatheque = document.querySelector(".formulaire_mediatheque_filtres");

if (filtres_mediatheque) {
  // form element
  let form_filtres_mediatheque = filtres_mediatheque.querySelector("form"),
    form_filtres_mediatheque_inputs_array = Array.from(filtres_mediatheque.querySelectorAll("input"));

  // init du dialog
  const dialogs = new WeakMap();
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
    }  });

  // console.log(form_filtres_mediatheque_inputs);
}
