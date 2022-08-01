(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.fraapCollapsible = factory());
})(this, (function () { 'use strict';

  /**
   * Collapsible (accordion)
   * Source https://inclusive-components.design/collapsible-sections/
   * @param {bool} trackHeadings - Reporter dans un champ hidden l'identifiant du bouton ouvert. Utile lors l'accordéon est utilisé dans un formulaire.
   */
  const collapsibleInit = (container, extend) => {
    // L'accordéon est utilisé dans un formulaire,
    // des fonctionnalités supplémentaires sont nécessaires.
    const extendMode = extend || false;
    const headings = container.querySelectorAll(".collapsible_heading");

    if (headings.length > 0) {
      Array.prototype.forEach.call(headings, (heading) => {
        let btn = heading.firstElementChild,
          target = heading.nextElementSibling,
          checkboxes,
          expanded = false;

        // Ajouter au bouton les labels des filtres déjà cochés
        if (extendMode) {
          checkboxes = heading.nextElementSibling.querySelectorAll(
            "input[type='checkbox']:checked"
          );

          expanded = btn.getAttribute("aria-expanded") === "true" || false;

          // Afficher la sélection
          if (expanded === false && checkboxes.length > 0) {
            addUserChoice(btn, checkboxes);
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
            checkboxes = heading.nextElementSibling.querySelectorAll(
              "input[type='checkbox']:checked"
            );
            if (expanded === true && checkboxes.length > 0) {
              addUserChoice(btn, checkboxes);
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
   * Ajouter dans le bouton les choix de l'utilisateur
   *
   * @param {node} btn Élément parent
   * @param {nodeList} checkboxes Les sélections de l'utilisateur
   */
  const addUserChoice = (btn, checkboxes) => {
    let labels = [];
    Array.prototype.forEach.call(checkboxes, (checkbox) => {
      labels.push(checkbox.dataset.label);
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

  return fraapCollapsible;

}));
