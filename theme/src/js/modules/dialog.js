import { module } from "modujs";
import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";
import { subMenuFromTo, displaySubMenu, resetMenu } from "../util/subMenu";

export default class extends module {
  constructor(m) {
    super(m);
    let self = this;
    this.type = this.getData("type");
    this.bodyscrollOptions = { allowTouchMove: () => true };
    this.handleTransition = this.handleTransition.bind(this);
    this.state = new Proxy({ status: "open" }, {
      set(state, key, value) {
        const oldValue = state[key];
        state[key] = value;

        if (oldValue !== value) {
          self.processState();
        }
        return state;
      }
    });
  }

  init() {
    this.dialog = new A11yDialog(this.el);
    // Conteneur du contenu
    this.$content = this.$("content");
    this.toggleState(this.state);

    // à l'ouverture de la modale
    this.dialog.on("show", (event) => {
      // Pour le dialog relatif au menu principal du site
      if (this.type == "menu") {
        // Récupérer l'identifiant de l'arborescence
        // à afficher sur le bouton d'ouverture.
        const opener = event.detail.target.closest('[data-a11y-dialog-show');
        let menuId = opener.getAttribute("data-menu-controls"),
          shortcut = this.$content[0].querySelector("a[data-menu-controls=" + menuId + "]"),
          submenuPath = subMenuFromTo(shortcut, this.el);

        // Afficher l'aborescence demandée.
        displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
      }

      // body scroll
      disableBodyScroll(this.el, this.bodyscrollOptions);
      this.toggleState(this.state, "open");
    });

    // à la fermeture du dialog
    this.dialog.on("hide", (event) => {
      // ajouter un état intermédiaire pour la transition du dialog
      this.toggleState(this.state, "closing");
      // une fois la transition terminée, le statut sera "closed"
      this.$content[0].addEventListener("transitionend", this.handleTransition);
    });
  }

  processState() {
    this.setData("status", this.state.status);
  }

  toggleState(state, newStatus) {
    if (newStatus) {
      if (state.status === newStatus) {
        return;
      }
      state.status = newStatus;
    } else {
      state.status = state.status === "closed" ? "open" : "closed";
    }
  }

  handleTransition(event) {
    this.toggleState(this.state, "closed");
    this.$content[0].removeEventListener("transitionend", this.handleTransition);
    enableBodyScroll(this.el, this.bodyscrollOptions);
  }

  close() {
    this.dialog.hide();
  }
};
