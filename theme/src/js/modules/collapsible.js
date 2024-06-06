// Menu principal (offcanvas)
import { module } from "modujs";
import {doc} from "../util/environment";

export default class extends module {
  constructor(m) {
    super(m);

    this.options = {
      extendMode: true
    }

    this.events = {
      click: {
        header: "toggleSectionCollapsible"
      }
    }
  }

    /**
   * Afficher sous forme textuelle les choix de l'utilisateur.
   * @param {Element} button
   * @param {Array} inputs
   */
  displayUserChoice(button, inputs) {
    let labels = [];
    for (const input of inputs) {
      labels.push(input.dataset.label);
    }

    if (labels.length > 0) {
      let span, labelText;
      span = doc.createElement("span");
      labelText = doc.createTextNode(labels.join(", "));

      span.appendChild(labelText);
      span.classList.add("collapsible_user-choice");
      button.firstElementChild.appendChild(span);
    }
  }

  toggleSectionCollapsible(event) {
    const target = event.currentTarget;
    const section = this.parent("section", target);
    const body = this.$("body", section);
    const button = target.querySelector("button");
    const hiddenInput = target.querySelector('input[name="btnOpen[]"]');

    // Statut de l'accordéon avant le clic et non après
    let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

    // 1- Basculer l'état du bouton
    button.setAttribute("aria-expanded", !isExpanded);

    // 2- Basculer la visibilité du contenu
    body[0].hidden = isExpanded;

    // 3- Mémoriser le nouvel état du bouton
    if (this.options.extendMode && !isExpanded) {
      hiddenInput.setAttribute("value", button.id);
    } else {
      hiddenInput.setAttribute("value", "");
    }

    if (this.options.extendMode) {
      // Récupérer le <span> qui affiche le choix de l'utilisateur.
      let userChoice = button.querySelector("span.collapsible_user-choice");

      // S'il existe, le supprimer à l'ouverture de l'accordéon
      if (userChoice) {
        userChoice.parentNode.removeChild(userChoice);
      }

      // Si le bouton est ouvert et si l'utilisateur le referme
      if (isExpanded) {
        // Récupérer les cases cochées
        let inputs = body[0].querySelectorAll("input:checked");

        // Mettre à jour la liste des choix.
        if (inputs.length > 0) {
          this.displayUserChoice(button, inputs);
        }
      }
    }
  }

  update() {
    if (this.options.extendMode) {
      let sections = this.$("section");
      sections.forEach((section) => {
        const button = section.querySelector("button");
        const body = this.$("body", section);
        const inputs = body[0].querySelectorAll("input:checked");

        let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

        if (isExpanded === false && inputs.length > 0) {
          this.displayUserChoice(button, inputs);
        }
      });
    }
  }

  init() {
    this.update();

  }

}
