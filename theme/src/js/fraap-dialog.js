import { subMenuFromTo, displaySubMenu, resetMenu } from "./util/subMenu";
import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

function FraapDialog(el, BodyScrollOptions) {
  const self = this;
  // Prebind pour éviter de perdre les références lors de l'ajout et du retrait de l'événement
  this._handleEvent = this._handleEvent.bind(this);
  this.el = el;
  this.options = BodyScrollOptions || {};
  this.document = this.el.querySelector('[role="document"]');
  this.state = new Proxy(
    {
      status: "open",
    },
    {
      set(state, key, value) {
        const oldValue = state[key];
        state[key] = value;
        if (oldValue !== value) {
          self._processState();
        }
        return state;
      },
    }
  );

  this.create();
}

FraapDialog.prototype.create = function () {
  this.dialog = new A11yDialog(this.el);
  this._toggleState(this.state);

  this.dialog.on("show", (dialogEl, dialogEvent) => {
    this._toggleState(this.state, "open");
    disableBodyScroll(this.el, this.options);
    // le bouton est un raccourci vers un sous-menu ?
    let menuId = dialogEvent.currentTarget.getAttribute("data-menu-controls");
    if (menuId && menuId !== "menu-0") {
      if (menuId !== "menu-0") {
        // Afficher le sous-menu souhaité à l'ouverture de la modale
        submenuControl(this.document, this.el, menuId);
      }
    }
  });

  this.dialog.on("hide", (dialogEl, dialogEvent) => {
    this._toggleState(this.state, "closing");
    this.document.addEventListener(
      "transitionend",
      this._handleEvent
    );
  });
};

FraapDialog.prototype._processState = function () {
  this.el.setAttribute("data-dialog-status", this.state.status);
};

FraapDialog.prototype._toggleState = function (state, newStatus) {
  if (newStatus) {
    if (state.status === newStatus) {
      return;
    }
    state.status = newStatus;
  } else {
    state.status = state.status === "closed" ? "open" : "closed";
  }
};

FraapDialog.prototype._handleEvent = function (event) {
  this._toggleState(this.state, "closed");
  this.document.removeEventListener("transitionend", this._handleEvent);
  enableBodyScroll(event.target, this.options);
  resetMenu(this.document);
};


function submenuControl(dialogDocument, dialogEl, menuId) {
  let shortcut = dialogDocument.querySelector("a[data-menu-controls=" + menuId + "]"),
    submenuPath = subMenuFromTo(shortcut, dialogEl);
  displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
}

export default FraapDialog;
