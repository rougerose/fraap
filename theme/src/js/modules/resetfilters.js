import { module } from "modujs";


/**
 * Ce module prend en charge les boutons de suppression
 * des filtres éventuellement cochés par l'utilisateur
 * pour les pages Annuaire des membres.
 * A noter que ces boutons sont logés dans un conteneur ajax
 * différent des filtres, raison pour laquelle ils sont gérés séparemment.
 */
export default class extends module {
  constructor(m) {
    super(m);

    this.events = {
      click: {
        button: "resetFilters",
      }
    }
  }

  resetFilters() {
    event.preventDefault(event);
    const params = event.currentTarget.search;
    let optionsAjax = {
      callback: () => {
          this.call("updateFilters", "", "filters");
        },
        args: {},
        history: true,
        href: "",
    };
    console.log("options", optionsAjax);

    if (params) {
      // Le bouton de suppression sélectionné contient encore
      // des paramètres regions, deparements, mots ou recherche.
      const urlParams = new URLSearchParams(params);
      const entries = urlParams.entries();
      let argsObj = {};

      for (const entry of entries) {
        const key = entry[0],
          value = entry[1];

        // If the key contains brackets, it's an array.
        if (key.indexOf("[]") !== -1) {
          let k = key.replace(/[\[\]]+/g, "");

          if (!argsObj.hasOwnProperty(k)) {
            argsObj[k] = [];
          }

          if (value !== "") {
            argsObj[k].push(value);
          }
        } else {
          if (key == "recherche" && value == "") {
            console.log(key, value);
            optionsAjax.history = false;
          } else {
            argsObj[key] = value;
          }
        }
      }

      optionsAjax = {
        callback: () => {
          this.call("updateFilters", "", "filters");
        },
        args: argsObj,
        history: true,
        href: "",
      };

    } else {
      // le bouton ne contient aucun paramètre -> url de départ de la rubrique
      const href = event.currentTarget.href;
      const url = new URL(href);

      // formulaire de recherche rubrique
      const search = document.querySelector(".formulaire_recherche_rubrique input[type='search']");
      if (search && search.value) {
        search.value = "";
      }

      // optionsAjax = {
      //   callback: () => {
      //     this.call("updateFilters", "", "filters");
      //   },
      //   args: {},
      //   history: true,
      //   href: url.origin + url.pathname,
      // };

      optionsAjax.args = {};
      optionsAjax.history = false;
      optionsAjax.href = url.origin + url.pathname;

      // On relance le bloc ajax "filtres" qui contient le formulaire.
      // Le callback met à jour le contenu du formulaire lui-même.
      // window.ajaxReload("filtres", {
      //   href: url.origin + url.pathname,
      //   callback: () => {
      //     this.call("updateFilters", "", "filters");
      //   },
      //   args: {},
      //   history: true,
      // });
    }
    // TODO : vérifier si optionsAjax contient des données ?
    console.log(optionsAjax);
    // On relance le bloc ajax "filtres" qui contient le formulaire.
    // Le callback met à jour le contenu du formulaire lui-même.
      window.ajaxReload("filtres", optionsAjax);
  }
}
