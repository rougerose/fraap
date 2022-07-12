import toggleState from "./util-toggleState";
import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const dialogSearchId = "dialogRecherche";
let dialogSearch, dialogSearchContent, state;

const dialogSearchState = new Proxy(
  {
    status: "open",
  },
  {
    set(state, key, value) {
      const oldValue = state[key];
      state[key] = value;
      if (oldValue !== value) {
        processDialogSearchState();
      }
      return state;
    },
  }
);

const processDialogSearchState = () => {
  // Statut de la fenêtre par défaut
  dialogSearch.setAttribute("data-dialog-status", dialogSearchState.status);
};

const searchDialogTransitionEnd = (event) => {
  toggleState(dialogSearchState, "closed");
  event.target.removeEventListener("transitionend", searchDialogTransitionEnd);
  // Rétablir le scroll
  enableBodyScroll(event.target);
};

const dialogSearchInit = () => {
  dialogSearch = document.querySelector("#" + dialogSearchId);

  if (dialogSearch) {
    let dialog = new A11yDialog(dialogSearch);

    dialogSearchContent = dialogSearch.querySelector(
      ".dialog-recherche_content"
    );
    toggleState(dialogSearchState);

    dialog.on("show", (dialogEl, dialogEvent) => {
      toggleState(dialogSearchState, "open");
      // Désactiver le scroll en dehors du menu
      disableBodyScroll(dialogSearch);
    });

    dialog.on("hide", (dialogEl, dialogEvent) => {
      toggleState(dialogSearchState, "closing");
      dialogSearchContent.addEventListener(
        "transitionend",
        searchDialogTransitionEnd
      );
    });
  }
}

const fraapDialogRecherche = {
  init: dialogSearchInit,
};

export default fraapDialogRecherche;
