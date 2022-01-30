import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

/**
 * responsive-nav
 * ---------------
 *
 * Trame du script inspiré de
 * https://github.com/mrwweb/clicky-menus
 * https://piccalil.li/tutorial/build-a-fully-responsive-progressively-enhanced-burger-menu/
 *
 */


/**
    TODO:
    - Utiliser BodyScroll pour la version écrans larges : stocker le conteneur cible dans une variable ?
    - Ajouter commentaires au fil du code.
*/

const defaults = {
  maxWidth: 1120,
  subNavSelector: ".c-nav_section",
};

const ResponsiveNav = function (nav, options) {
  const responsiveNav = {};

  let settings,
    navToggle,
    navMenu,
    navOverlay,
    currentSubNav,
    processNavMenuStatus = false;

  responsiveNav.init = function () {
    settings = Object.assign(defaults, options);
    navSetup();
  };

  const observer = new ResizeObserver((observedItems) => {
    const { contentRect } = observedItems[0];
    let setWidth = contentRect.width >= settings.maxWidth;

    if (setWidth) {
      let menuWidth = navMenu.clientWidth / 16 + "rem";
      navMenu.style.setProperty("--menuWidth", menuWidth);
      navMenu.setAttribute("aria-hidden", "false");
      processNavMenuStatus = true;
      state.navMenu = state.navMenu === "closed" ? "closed" : "open";
    } else {
      navMenu.setAttribute("aria-hidden", "true");
      processNavMenuStatus = false;
      state.navMenu = "closed";
    }
  });

  const state = new Proxy(
    { currentSubNav: null, navMenu: "closed", navToggle: "closed" },
    {
      set: function (state, key, value) {
        const oldValue = state[key];

        if (key == "navToggle") {
          navToggle.setAttribute(
            "aria-expanded",
            value === "closed" ? "false" : "true"
          );
          navMenu.setAttribute(
            "aria-hidden",
            value === "closed" ? "true" : "false"
          );
        }

        if (key == "currentSubNav") {
          let button = value;
          let subNav = document.getElementById(
            button.getAttribute("aria-controls")
          );

          // console.log(button, subNav);

          if ("true" === button.getAttribute("aria-expanded")) {
            button.setAttribute("aria-expanded", "false");
            subNav.setAttribute("aria-hidden", "true");
          } else {
            button.setAttribute("aria-expanded", "true");
            subNav.setAttribute("aria-hidden", "false");
          }

          if (value == oldValue) {
            value = null;
          }
        }

        if (key == "navMenu") {
          navMenu.setAttribute("data-status", value);
        }

        state[key] = value;

        // console.log("value", value);
        // console.log("oldvalue", oldValue);

        return true;
      },
    }
  );

  const navSetup = () => {
    navToggle = nav.querySelector("#nav-toggle");
    if (navToggle) {
      navMenu = nav.querySelector(
        "#" + navToggle.getAttribute("aria-controls")
      );
    }

    if (navMenu) {
      // Ajouter l'observer sur header.c-site-head
      observer.observe(nav.parentElement);

      // Confirmer l'activation du JS
      navMenu.setAttribute("data-js", true);
      navToggle.setAttribute("data-enabled", true);

      nav.querySelectorAll(settings.subNavSelector).forEach((subNav) => {
        const navItem = subNav.closest("li");

        if ("undefined" !== typeof navItem) {
          let button = convertLinkToButton(navItem);
          setupAria(subNav, button);
          button.addEventListener("click", toggleOnMenuClick);
        }
      });

      navMenu.addEventListener("keyup", closeOnEscKey);
      navOverlay = nav.querySelector("div[data-menu-overlay]");
      navOverlay.addEventListener("click", closeOnOverlay);

      navToggle.addEventListener("click", (event) => {
        let button = event.currentTarget.closest("button");
        if (button) {
          toggle(button);
        }
      });
    }
  };

  const convertLinkToButton = (navItem) => {
    const link = navItem.getElementsByTagName("a")[0],
      linkHTML = link.innerHTML,
      linkAttr = link.attributes,
      button = document.createElement("button");

    if (null !== link) {
      // Copier contenu et attributs du lien vers le bouton
      button.innerHTML = linkHTML.trim();

      for (let i = 0; i < linkAttr.length; i++) {
        let attr = linkAttr[i];
        if ("href" !== attr.name) {
          button.setAttribute(attr.name, attr.value);
        }
      }
      navItem.replaceChild(button, link);
    }
    return button;
  };

  const setupAria = (subNav, button) => {
    let id;
    const subNavId = subNav.getAttribute("id");

    if (null === subNavId) {
      id =
        button.textContent.trim().replace(/\s+/g, "-").toLowerCase() +
        "-submenu";
    } else {
      id = subNavId;
    }

    // ajouter button ARIA
    button.setAttribute("aria-controls", id);
    button.setAttribute("aria-expanded", false);
    // ajouter subNav ARIA
    subNav.setAttribute("id", id);
    subNav.setAttribute("aria-hidden", true);
  };

  const toggle = (el) => {
    if (el.tagName === "BUTTON") {
      if (el.id === "nav-toggle") {
        state.navToggle = state.navToggle === "closed" ? "open" : "closed";
        // if (processNavMenuStatus) {
        //   // Synchroniser le statut du menu
        //   state.navMenu = state.navToggle;
        // }

        if (state.navToggle == "open") {
          // Bloquer le scroll sur l'élément body
          disableBodyScroll(navMenu);
        } else {
          // Supprimer le blocage du scroll
          enableBodyScroll(navMenu);
        }

        // Fermer également le sous-menu laissé ouvert
        if (state.navToggle === "closed" && state.currentSubNav) {
          state.currentSubNav = state.currentSubNav;
        }
      } else {
        state.currentSubNav = el;
      }
    }
  };

  const toggleOnMenuClick = (event) => {
    let target = event.currentTarget;
    let stateNavMenu = state.navMenu === "closed" ? "open" : "closed";

    if (processNavMenuStatus && !state.currentSubNav) {
      stateNavMenu = "open";
    }

    if (state.currentSubNav && target !== state.currentSubNav) {
      // console.log("toggle 1", stateNavMenu, state.currentSubNav);
      toggle(state.currentSubNav);
      stateNavMenu = "open";
    }

    if (processNavMenuStatus) {
      // if (stateNavMenu == "open") {
      //   console.log("toggle 2", target);
      // } else {
      //   console.log("toggle 3", stateNavMenu, target);
      // }
      state.navMenu = stateNavMenu;
    }

    toggle(target);
  };

  const closeOnEscKey = (event) => {
    if (27 === event.keyCode) {
      // console.log(
      //   "esc event",
      //   event.target,
      //   event.target.closest("div.c-nav_section[aria-hidden='false']")
      // );
      // Hypothèse 1 : le curseur est dans un sous-menu ouvert
      // Hypothèse 2 : le curseur est sur le bouton d'ouverture du sous-menu
      if (
        null !== event.target.closest("div.c-nav_section[aria-hidden='false']")
      ) {
        state.currentSubNav.focus();
        toggle(state.currentSubNav);
        state.navMenu = "closed";
      } else if ("true" === event.target.getAttribute("aria-expanded")) {
        toggle(state.currentSubNav);
        state.navMenu = "closed";
      }
    }
  };

  const closeOnOverlay = (event) => {
    // console.log("overlay", state.currentSubNav);
    toggle(state.currentSubNav);
    state.navMenu = "closed";
  };

  return responsiveNav;
};

export default ResponsiveNav;
