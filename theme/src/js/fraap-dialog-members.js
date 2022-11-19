import toggleState from "./util/toggleState";
import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const dialogMembersId = "dialogMembers";
let dialogInstance, dialogMembers, dialogMembersContent;


const dialogMembersState = new Proxy(
  {
    status: "open",
  },
  {
    set(state, key, value) {
      const oldValue = state[key];
      state[key] = value;
      if (oldValue !== value) {
        dialogMembersProcessState();
      }
      return state;
    },
  }
);


const dialogMembersProcessState = () => {
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
    dialogInstance = new A11yDialog(dialogMembers);

    dialogMembersContent = dialogMembers.querySelector(".dialog_content");
    toggleState(dialogMembersState, "closed");

    dialogInstance.on("show", (dialogEl, dialogEvent) => {
      toggleState(dialogMembersState, "open");
      // Désactiver le scroll en dehors du menu
      disableBodyScroll(dialogMembersContent, { allowTouchMove: () => true });
    });

    dialogInstance.on("hide", (dialogEl, dialogEvent) => {
      toggleState(dialogMembersState, "closing");
      dialogMembersContent.addEventListener(
        "transitionend",
        dialogMembersTransitionEnd
      );
    });

    return dialogInstance;
  }
}

const fraapDialogMembers = {
  init: dialogMembersInit,
};

export default fraapDialogMembers;
