import { module } from "modujs";
import { serializeFormData } from "../util/form";
import {doc} from "../util/environment";

// Ce module prend en charge les filtres disponibles
// pour un contenu (recherche, médiathèque, etc.).
export default class extends module {
  constructor(m) {
    super(m);

    this.options = {
      ajaxTarget: {
        filters: "filtres",
        content: ""
      }
    };

    this.events = {
      change: {
        filters: "updateFilters"
      }
    }
  }

  // TODO A supprimer ?
  // checkInitStateFilters() {
  //   let needUpdate = false;
  //   const formData = this.getFormData();
  //   const ignoreKeys = [
  //     "var_ajax",
  //     "formulaire_action",
  //     "formulaire_action_args",
  //     "formulaire_action_sign"
  //   ];

  //   for (const key in formData) {
  //     if (!ignoreKeys.includes(key) && formData[key]) {
  //       needUpdate = true;
  //     }
  //   }
  //   if (needUpdate) {
  //     this.updateFilters();
  //   }
  // }

  closeDialog() {
    this.form[0].removeEventListener("submit", this.submitForm);
    this.call("close", "", "dialog", this.dialogModuleId);
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
    // console.log(formObj);
    return formObj;
  }

  // remoteUpdateFilters(checkedInputs) {

  // }

  /**
   * Mettre à jour, via ajaxReload, le bloc du contenu principal
   * de la page. L'url de la page est mise à jour (history: true).
   * @param {Boolean} closeDialog Fermer ou non le dialog des filtres
   */
  updateContent(closeDialog) {
    let formData = this.getFormData(),
      acceptKeys = ["type_ref", "mots", "typologie", "annee", "departements", "regions"],
      argObj = {},
      closeCB = closeDialog || false;

    for (let key in formData) {
      if (formData.hasOwnProperty(key) && acceptKeys.includes(key)) {
        // Conserver uniquement les valeurs de type array et string non vide
        // Sinon elles ne sont pas supprimées de l'url.
        if (formData[key] === "") {
          argObj[key] = null;
        } else {
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
      callback: () => {
        this.updateForm();
        this.call("update", "", "collapsible", this.collapsibleModuleIdId);
      },
      args: this.getFormData(),
    });

    this.updateContent(false);
  }

  updateForm() {
    this.form[0].addEventListener("submit", this.submitForm);
  }

  submitForm(event) {
    event.preventDefault();
    this.updateContent(true);
  }

  init() {
    this.form = this.el.getElementsByTagName("form");

    this.submitForm = this.submitForm.bind(this);

    // Récupérer le nom du bloc ajax du contenu principal
    this.options.ajaxTarget.content = this.getData("content");

    // Mémoriser l'id du dialog parent qui sera télécommandé par closeDialog()
    this.dialogModuleId = this.el.parentNode.closest("[data-module-dialog]").getAttribute("data-module-dialog");

    // Mémoriser l'id du module collapsible lié aux filtres
    this.collapsibleModuleId = this.el.getAttribute("data-module-collapsible");

    // Identifier et mémoriser les filtres utilisés
    let names = ["btnOpen[]", "mots[]", "departements[]", "regions[]", "type_ref", "typologie", "annee"];

    this.mainInputs = [];

    for (const item of this.form[0]) {
      if (names.includes(item.name) && !this.mainInputs.includes(item.name)) {
        this.mainInputs.push(item.name);
      }
    }

    // this.checkInitStateFilters();
    this.updateForm();
  }
}
