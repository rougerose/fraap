import { module } from "modujs";


/**
 * Ce module prend en charge les boutons de suppression des filtres éventuellement cochés par l'utilisateur pour les pages Annuaire des membres.
 * A noter que ces boutons sont logés dans un conteneur ajax différent des filtres, raison pour laquelle, ils sont gérés à part.
 */
export default class extends module {
  constructor(m) {
    super(m);

    this.events = {
      click: {
        button: "doThing",
      }
    }
  }

  doThing() {
    event.preventDefault(event);
    const params = event.currentTarget.search;

    if (params) {
      const urlParams = new URLSearchParams(params);
      console.log("params", urlParams);
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
          argsObj[key] = value;
        }
      }

      window.ajaxReload("filtres", {
        callback: () => {
          this.call("updateFilters", "", "filters");
        },
        args: argsObj,
        history: true,
      });
    } else {
      const href = event.currentTarget.href;
      const url = new URL(href);
      console.log("url", url);
      // window.ajaxReload("annuaire", {
      //   href: url.origin + url.pathname,
      //   history: true,
      // });
      window.ajaxReload("filtres", {
        href: url.origin + url.pathname,
        callback: () => {
          this.call("updateFilters", "", "filters");
        },
        args: {},
        history: true,
      });
    }

    // window.ajaxReload(
    //   "filtres",
    //   { callback: function () { console.log("fini"); } },
    // );
  }
}
