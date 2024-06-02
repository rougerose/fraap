import { module } from "modujs";
import { doc } from "../util/environment";

export default class extends module {
  constructor(m) {
    super(m);

    this.extendMode = false;
    this.headers = this.$("header");

    this.events = {
      click: { header: "toggleSection" }
    };
  };

  init() {
    if (this.getData('extend') === "true") {
      this.extendMode = true;
    }

    this.headers.forEach((header, index) => {
      if (this.extendMode) {
        let button = header.querySelector("button"),
          content = header.nextElementSibling,
          // Récupérer les boutons cochés au chargement
          inputs = content.querySelectorAll("input:checked"),
          // Bouton ouvert ou fermé
          isExpanded = button.getAttribute("aria-expanded") === "true" || false;

        // Si l'élément est fermé, affiché en résumé
        // les boutons cochés déjà cochés.
        if (isExpanded === false && inputs.length > 0) {
          this.displayUserChoice(button, inputs);
        }
      }
    });
  }

  displayUserChoice(button, inputs) {
    let labels = [];
    inputs.forEach((input) => {
      labels.push(input.dataset.label);
    });

    if (labels.length > 0) {
      let span = doc.createElement("span"),
        labelText = doc.createTextNode(labels.join(", "));

      span.appendChild(labelText);
      span.classList.add("collapsible_user-choice");
      button.firstElementChild.appendChild(span);
    }
  }

  toggleSection(event) {
    const header = event.currentTarget;
    const button = header.querySelector("button");
    const content = header.nextElementSibling;

    // Afficher ou non le contenu
    let isExpanded = button.getAttribute("aria-expanded") === "true" || false;
    button.setAttribute("aria-expanded", !isExpanded);
    content.hidden = isExpanded;

    if (this.extendMode) {
      // Récupérer le champ hidden
      let inputHidden = button.nextElementSibling;

      // Récupérer le span qui affiche le choix de l'utilisateur,
      // s'il existe.
      let userChoice = button.querySelector("span.collapsible_user-choice");

      // Et s'il existe, le supprimer.
      if (userChoice) {
        userChoice.parentNode.removeChild(userChoice);
      }

      // Récupérer les cases cochées par l'utilisateur
      let inputs = content.querySelectorAll("input:checked");

      if (isExpanded === true && inputs.length > 0) {
        this.displayUserChoice(button, inputs);
      }

      if (!isExpanded) {
        inputHidden.setAttribute("value", button.id);
      } else {
        inputHidden.setAttribute("value", "");
      }
    }
  }

  open() {
    //console.log("update collapsible");
  }
}
