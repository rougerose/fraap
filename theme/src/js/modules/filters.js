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
      ajaxTarget: {
        filters: "filtres",
        content: ""
      }
    };

    this.events = {
      change: {
        filters: "updateFilters"
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
        // console.log(key, !ignoreKeys.includes(key));
        needUpdate = true;
      }
    }
    if (needUpdate) {
      this.updateFilters();
    }
  }

  closeDialog() {
    this.form[0].removeEventListener("submit", this.submitForm);
    this.call("close", "", "dialog", this.dialogModuleId);
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

    // l'API FormData n'envoie pas les champs vides tels
    // que les checkbox mots[]. Ce comportement entraîne
    // un problème au rechargement du formulaire via ajax :
    // un checkbox coché puis décoché reste coché...
    // Par conséquent, on ajoute tous les paramètres principaux,
    // même s'ils sont vides.
    for (const input of this.mainInputs) {
      if (!formData.has(input)) {
        formData.set(input, "");
      }
    }

    let formObj = serializeFormData(formData);

    return formObj;
  }

  /**
   * Mettre à jour, via ajaxReload, le bloc du contenu principal
   * de la page. L'url de la page est mise à jour (history: true).
   * @param {Boolean} closeDialog Fermer ou non le dialog des filtres
   */
  updateContent(closeDialog) {
    let formData = this.getFormData(),
      acceptKeys = ["type_ref", "mots"],
      argObj = {},
      closeCB = closeDialog || false;

    for (let key in formData) {
      if (formData.hasOwnProperty(key) && acceptKeys.includes(key)) {
        // Conserver uniquement les valeurs de type array et string non vide
        if (formData[key] !== "") {
          argObj[key] = formData[key];
        }
      }
    }

    window.ajaxReload(this.options.ajaxTarget.content, {
      callback: () => {
        if (closeCB) this.closeDialog()
      },
      args: argObj,
      history: true,
    });

  }

  updateFilters() {
    this.form[0].removeEventListener("submit", this.submitForm);

    window.ajaxReload(this.options.ajaxTarget.filters, {
      callback: () => { this.updateForm() },
      args: this.getFormData(),
    });

    this.updateContent(false);
  }

  updateForm() {
    this.form[0].addEventListener("submit", this.submitForm);

    // updateForm collapsibles
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

  submitForm(event) {
    event.preventDefault();
    this.updateContent(true);
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

    this.options.ajaxTarget.content = this.getData("content");

    // Identifier et mémoriser les champs principaux
    let names = ["btnOpen[]", "mots[]", "type_ref"];
    this.mainInputs = [];
    for (const item of this.form[0]) {
      if (names.includes(item.name) && !this.mainInputs.includes(item.name)) {
        this.mainInputs.push(item.name);
      }
    }

    // Mémoriser l'id du dialog parent qui sera télécommandé par closeDialog()
    let dialogModule = this.el.parentNode.closest("[data-module-dialog]");
    this.dialogModuleId = dialogModule.getAttribute("data-module-dialog");


    this.checkInitStateFilters();
    this.updateForm();
  }
}
