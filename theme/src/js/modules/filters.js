import { module } from "modujs";
import { serializeFormData } from "../util/form";
import {doc} from "../util/environment";

// Ce module prend en charge les filtres disponibles
// pour un contenu(recherche, médiathèque, etc.)
// ET les accordéons(collapsible) qui regroupent
// les filtres par thème.
export default class extends module {
  constructor(m) {
    super(m);

    this.options = {
      // Les accordéons sont contenus dans un formulaire
      extendMode: true,
      // Le nom du bloc ajax Spip est toujours le même, quelque soit la page source.
      ajaxTarget: "filtres",
    };

    this.events = {
      change: {
        filters: "queryFilters"
      },
      click: {
        header: "toggleSectionCollapsible"
      }
    }
  }

  checkInitStateFilters() {
    let needUpdate = false;
    const formData = this.getFormData();
    const ignoreKeys = [
      "var_ajax",
      "formulaire_action",
      "formulaire_action_args",
      "formulaire_action_sign"
    ];
    for (const key in formData) {

      if (!ignoreKeys.includes(key) && formData[key]) {
        needUpdate = true;
      }
    }
    if (needUpdate) {
      this.queryFilters();
    }
  }

  update() {
    this.form[0].addEventListener("submit", this.submitForm);

    // update collapsibles
    if (this.options.extendMode) {
      this.sections = this.$("section");
      this.sections.forEach((section) => {
        const button = section.querySelector("button");
        const content = this.$("content", section);
        const inputs = content[0].querySelectorAll("input:checked");
        let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

        if (isExpanded === false && inputs.length > 0) {
          this.displayUserChoice(button, inputs);
        }
      });
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

  getFormData() {
    let formData = new FormData(this.form[0]);
    let formObj = serializeFormData(formData);
    console.log(formObj);
    return formObj;
  }

  queryFilters() {
    this.form[0].removeEventListener("submit", this.submitForm);
    window.ajaxReload(this.options.ajaxTarget, {
      callback: () => { this.update() },
      args: this.getFormData(),
    });
  }

  submitForm(event) {
    event.preventDefault();
    console.log("submit");
    this.queryFilters();
  }

  toggleSectionCollapsible(event) {
    const target = event.currentTarget;
    const section = this.parent("section", target);
    const content = this.$("content", section);
    const button = target.querySelector("button");
    const hiddenInput = target.querySelector('input[name="btnOpen[]"]');

    // Statut de l'accordéon avant le clic et non après
    let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

    // 1- Basculer l'état du bouton
    button.setAttribute("aria-expanded", !isExpanded);

    // 2- Basculer la visibilité du contenu
    content[0].hidden = isExpanded;

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
        let inputs = content[0].querySelectorAll("input:checked");

        // Mettre à jour la liste des choix.
        if (inputs.length > 0) {
          this.displayUserChoice(button, inputs);
        }
      }
    }
  }

  init() {
    this.form = this.el.getElementsByTagName("form");
    this.submitForm = this.submitForm.bind(this);
    this.checkInitStateFilters();
    this.update();
  }
}
