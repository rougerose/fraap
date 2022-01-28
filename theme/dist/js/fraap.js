(function () {
  'use strict';

  /**
   * Object for creating click-triggered navigation submenus
   * https://github.com/mrwweb/clicky-menus
   *
   * Thanks for the inspiration:
   * 		- https://www.lottejackson.com/learning/a-reusable-javascript-toggle-pattern
   * 		- https://codepen.io/lottejackson/pen/yObQRM
   */
  const ClickyMenus = function (menu, options) {
    // Surcharge
    this.options = {
      submenuSelector: "ul",
      buttonClass: "",
    };
    this.options = Object.assign(this.options, options);

    // DOM element(s)
    let container = menu.parentElement,
      currentMenuItem,
      i,
      len;

    this.init = function () {
      menuSetup(this.options);
      document.addEventListener("click", closeOpenMenu);
    };

    /*===================================================
    =            Menu Open / Close Functions            =
    ===================================================*/
    function toggleOnMenuClick(e) {
      const button = e.currentTarget;

      // close open menu if there is one
      if (currentMenuItem && button !== currentMenuItem) {
        toggleSubmenu(currentMenuItem);
      }

      toggleSubmenu(button);
    }

    function toggleSubmenu(button) {
      const submenu = document.getElementById(
        button.getAttribute("aria-controls")
      );

      if ("true" === button.getAttribute("aria-expanded")) {
        button.setAttribute("aria-expanded", false);
        submenu.setAttribute("aria-hidden", true);
        currentMenuItem = false;
      } else {
        button.setAttribute("aria-expanded", true);
        submenu.setAttribute("aria-hidden", false);
        // preventOffScreenSubmenu(submenu);
        currentMenuItem = button;
      }
    }

    function closeOnEscKey(e) {
      if (27 === e.keyCode) {
        // we're in a submenu item
        if (null !== e.target.closest('ul[aria-hidden="false"]')) {
          currentMenuItem.focus();
          toggleSubmenu(currentMenuItem);

          // we're on a parent item
        } else if ("true" === e.target.getAttribute("aria-expanded")) {
          toggleSubmenu(currentMenuItem);
        }
      }
    }

    function closeOpenMenu(e) {
      if (currentMenuItem && !e.target.closest("#" + container.id)) {
        toggleSubmenu(currentMenuItem);
      }
    }

    /*===========================================================
    =            Modify Menu Markup & Bind Listeners            =
    =============================================================*/
    function menuSetup(options) {
      menu.classList.remove("no-js");

      // surcharge (options.submenuSelector)
      menu.querySelectorAll(options.submenuSelector).forEach((submenu) => {
        // const menuItem = submenu.parentElement;
        const menuItem = submenu.closest("li");

        if ("undefined" !== typeof submenu) {
          let button = convertLinkToButton(menuItem);

          setUpAria(submenu, button);

          // Surcharge
          if (options.buttonClass !== "") {
            button.classList.add(options.buttonClass);
          }

          // bind event listener to button
          button.addEventListener("click", toggleOnMenuClick);
          menu.addEventListener("keyup", closeOnEscKey);
        }
      });
    }

    /**
     * Why do this? See https://justmarkup.com/articles/2019-01-21-the-link-to-button-enhancement/
     */
    function convertLinkToButton(menuItem) {
      const link = menuItem.getElementsByTagName("a")[0],
        linkHTML = link.innerHTML,
        linkAtts = link.attributes,
        button = document.createElement("button");

      if (null !== link) {
        // copy button attributes and content from link
        button.innerHTML = linkHTML.trim();
        for (i = 0, len = linkAtts.length; i < len; i++) {
          let attr = linkAtts[i];
          if ("href" !== attr.name) {
            button.setAttribute(attr.name, attr.value);
          }
        }

        menuItem.replaceChild(button, link);
      }

      return button;
    }

    function setUpAria(submenu, button) {
      const submenuId = submenu.getAttribute("id");
      let id;
      if (null === submenuId) {
        id =
          button.textContent.trim().replace(/\s+/g, "-").toLowerCase() +
          "-submenu";
      } else {
        // surcharge
        id = submenuId; // + "-submenu";
      }

      // set button ARIA
      button.setAttribute("aria-controls", id);
      button.setAttribute("aria-expanded", false);

      // set submenu ARIA
      submenu.setAttribute("id", id);
      submenu.setAttribute("aria-hidden", true);
    }
  };

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

  /**
   *
   */
  const nav = document.getElementById("nav");
  const navList = document.getElementById("nav-list");

  if (nav && navList) {
    new ClickyMenus(navList, {
      submenuSelector: ".c-nav_section",
    });
    // clickyMenu.init();
    new ResponsiveNav(nav, {});
    // responsiveNav.init();

    // const navToggle = nav.querySelector("#nav-toggle");
    // let isNavExpanded = navToggle.getAttribute("aria-expanded") === "true";

    // navToggle.removeAttribute("hidden");
    // navToggle.setAttribute("data-state", "visible");

    // const toggleNavVisibility = () => {
    //   isNavExpanded = !isNavExpanded;
    //   navToggle.setAttribute("aria-expanded", isNavExpanded);
    // };

    // navToggle.addEventListener("click", toggleNavVisibility);
  }

})();
