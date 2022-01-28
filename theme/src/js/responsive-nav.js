const ResponsiveNav = function (nav, options) {
  const self = this;

  this.root = nav;

  this.options = {
    maxWidth: 1120,
  };

  this.options = Object.assign(this.options, options);

  this.init = function () {
    setupResponsiveNav();
  };

  this.state = new Proxy(
    { status: "open", enabled: true },
    {
      set(state, key, value) {
        const oldValue = state[key];
        state[key] = value;
        if (oldValue !== value) {
          processStateChange();
        }
        return state;
      },
    }
  );



  this.observer = new ResizeObserver(observedItems => {
    const { contentRect } = observedItems[0];
    let setWidth = contentRect.width >= self.options.maxWidth;

    if (setWidth) {
      let menuWidth = self.navMenu.clientWidth / 16 + "rem";
      self.navMenu.style.setProperty("--menuWidth", menuWidth);
    }

    // let stateEnabled = contentRect.width <= self.options.maxWidth;
    // self.state.enabled = stateEnabled;
  });

  function toggle(forcedStatus) {
    if (forcedStatus) {
      if (self.state.status === forcedStatus) {
        return;
      }

      self.state.status = forcedStatus;
    } else {
      self.state.status = self.state.status === "closed" ? "open" : "closed";
    }
  }

  function processStateChange() {
    self.root.setAttribute("status", self.state.status);
    self.root.setAttribute("enabled", self.state.enabled ? "true" : "false");
    self.navToggle.setAttribute("data-enabled", self.state.enabled ? "true" : "false");
    self.navMenu.setAttribute("data-status", self.state.status);
    self.navMenu.setAttribute("enabled", self.state.enabled ? "true" : "false");

    switch (self.state.status) {
      case "closed":
        self.navToggle.setAttribute("aria-expanded", "false");
        self.navToggle.setAttribute("aria-label", "Ouvrir le menu principal");
        break;
      case "open":
        self.navToggle.setAttribute("aria-expanded", "true");
        self.navToggle.setAttribute("aria-label", "Fermer le menu principal");
        break;
    }
  }

  function setupResponsiveNav() {
    self.navToggle = self.root.querySelector("#nav-toggle");
    self.navMenu = self.root.querySelector("#nav-menu");
    self.btns = self.navMenu.querySelectorAll("button.c-nav_link");

    if (self.navToggle && self.navMenu && self.btns) {
      // Afficher le bouton d'activation de la navigation
      self.navToggle.removeAttribute("hidden");
      // Le js est actif
      self.navMenu.dataset.js = "true";
      // Ajouter l'API Observer sur header.c-site-head
      self.observer.observe(self.root.parentNode);
      toggle();

      self.navToggle.addEventListener("click", (event) => {
        event.preventDefault();
        toggle();
      });
      for (let btn of self.btns) {
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          console.log(event);
          // toggle();
        });
      }
    }
  }
};

export default ResponsiveNav;

/*
class BurgerMenu extends HTMLElement {
  constructor() {
    super();

    const self = this;

    this.state = new Proxy(
      {
        status: "open",
        enabled: false,
      },
      {
        set(state, key, value) {
          const oldValue = state[key];

          state[key] = value;
          if (oldValue !== value) {
            self.processStateChange();
          }
          return state;
        },
      }
    );
  }

  get maxWidth() {
    return parseInt(this.getAttribute("max-width") || 9999, 10);
  }

  connectedCallback() {
    this.initialMarkup = this.innerHTML;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="burger-menu" data-element="burger-root">
        <button class="burger-menu__trigger" data-element="burger-menu-trigger" type="button" aria-label="Open menu">
          <span class="burger-menu__bar" aria-hidden="true"></span>
        </button>
        <div class="burger-menu__panel" data-element="burger-menu-panel">
          ${this.initialMarkup}
        </div>
      </div>
    `;

    this.postRender();
  }
}

if ("customElements" in window) {
  customElements.define("burger-menu", BurgerMenu);
}

export default BurgerMenu;
*/
