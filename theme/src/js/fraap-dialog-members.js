import toggleState from "./util/toggleState";
import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const dialogMembersId = "dialogMembers";
let dialogMembers, dialogMembersContent;


const dialogMembersState = new Proxy(
  {
    status: "open",
  },
  {
    set(state, key, value) {
      const oldValue = state[key];
      state[key] = value;
      if (oldValue !== value) {
        processDialogMembersState();
      }
      return state;
    },
  }
);


const processDialogMembersState = () => {
  // Statut de la fenêtre par défaut
  dialogMembers.setAttribute("data-dialog-status", dialogMembersState.status);
};


const dialogMembersTransitionEnd = (event) => {
  toggleState(dialogMembersState, "closed");
  event.target.removeEventListener("transitionend", dialogMembersTransitionEnd);
  // Rétablir le scroll
  enableBodyScroll(event.target);
};


/**
 * Init
 */
const dialogMembersInit = () => {
  dialogMembers = document.querySelector("#" + dialogMembersId);

  if (dialogMembers) {
    let dialog = new A11yDialog(dialogMembers);

     dialogMembersContent = dialogMembers.querySelector(
       ".dialog_content"
     );
    toggleState(dialogMembersState);

    dialog.on("show", (dialogEl, dialogEvent) => {
      toggleState(dialogMembersState, "open");
      // Désactiver le scroll en dehors du menu
      disableBodyScroll(dialogMembersContent);
      // disableBodyScroll(menu.offcanvas.body, { allowTouchMove: () => true });
    });

    dialog.on("hide", (dialogEl, dialogEvent) => {
      toggleState(dialogMembersState, "closing");
      dialogMembersContent.addEventListener(
        "transitionend",
        dialogMembersTransitionEnd
      );
    });
  }
}


const fraapDialogMembers = {
  init: dialogMembersInit,
};

export default fraapDialogMembers;
