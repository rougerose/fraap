import A11yDialog from "a11y-dialog";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import * as smoothscroll from "smoothscroll-polyfill";

const menu = {};
const menuOffcanvasId = "siteNavOffcanvas";
const menuOffcanvasOpenerId = "buttonNavBurger";
const menuShortcutsId = "navShortcuts";

/**
 * Menu offcanvas
 * .
 * Sources :
 * https://piccalil.li/tutorial/build-a-fully-responsive-progressively-enhanced-burger-menu/
 * https://dbushell.com/2021/06/17/css-off-canvas-responsive-navigation/
 * .
 */

let isScroll = false,
  onScrollTimeout = "",
  onScrollEnd = [];

const menuOffCanvasInit = () => {
  let container = document.querySelector("#" + menuOffcanvasId);

  if (container) {
    let content = container.querySelector('div[role="document"]'),
      openBtn = document.querySelector("#" + menuOffcanvasOpenerId),
      dialog = new A11yDialog(container),
      shortcuts = content.querySelectorAll(
        'li[data-type-link="shortcut"] [href][data-menu-controls]'
      );

    resetMenu(content);

    shortcuts.forEach((shortcut) => {
      let subMenuPath = subMenuFromTo(shortcut, content);

      shortcut.addEventListener("click", (event) => {
        event.preventDefault();
        displaySubMenu(shortcut, subMenuPath.from, subMenuPath.to);
      });
    });

    return {
      container,
      content,
      openBtn,
      dialog,
    };
  } else {
    return null;
  }
};

// Proxy pour enregistrer l'état du menu.
// 3 états possibles: open / closing / closed
const state = new Proxy(
  {
    status: "open",
    enabled: false,
  },
  {
    set(state, key, value) {
      const oldValue = state[key];
      state[key] = value;
      if (oldValue !== value) {
        processState();
      }
      return state;
    },
  }
);

const toggleState = (newStatus) => {
  if (newStatus) {
    if (state.status === newStatus) {
      return;
    }
    state.status = newStatus;
  } else {
    state.status = state.status === "closed" ? "open" : "closed";
  }
};

const processState = () => {
  let offcanvas = menu.offcanvas.container,
    openBtn = menu.offcanvas.openBtn;

  // Statut du menu par défaut
  offcanvas.setAttribute("data-menu-status", state.status);

  // Statut de bouton d'ouverture
  switch (state.status) {
    case "closed":
      openBtn.setAttribute("aria-expanded", "false");
      break;
    case "open":
      openBtn.setAttribute("aria-expanded", "true");
      break;
    case "closing":
      openBtn.setAttribute("aria-expanded", "false");
      break;
  }
};

const dialogTransitionEnd = (event) => {
  // Considérer uniquement le div[role="document"] et non le bouton de fermeture
  if (event.target.hasAttribute("role")) {
    toggleState("closed");
    event.target.removeEventListener("transitionend", dialogTransitionEnd);
    let body = event.target.querySelector(".site-nav_body");
    resetMenu(body);
    // Rétablir le scroll
    enableBodyScroll(event.target);
  }
};

// Défilement des sous-menus
const onScroll = (event) => {
  isScroll = true;
  clearTimeout(onScrollTimeout);
  onScrollTimeout = setTimeout(() => {
    event.target.removeEventListener("scroll", onScroll, { passive: true });
    onScrollEnd.map((fn) => fn());
    onScrollEnd = [];
    isScroll = false;
  }, 50);
};

// Identifier les éléments DOM du menu qui forment
// le point de départ et le point d'arrivée.
const subMenuFromTo = (shortcut, container) => {
  let from = shortcut.closest(".site-nav_list"),
    to = container.querySelector(new URL(shortcut.href).hash);
  return { from: from, to: to };
};

smoothscroll.polyfill();

// Afficher les sous-menus et permettre un lien retour
const displaySubMenu = (shortcut, from, to) => {
  const isBack = from.compareDocumentPosition(to) === 2;
  let menuBody = shortcut.closest("div.site-nav_body");

  to.setAttribute("aria-hidden", "false");
  from.scrollIntoView({ inline: "start" });

  menuBody.addEventListener("scroll", onScroll, { passive: true });
  let left = isBack ? 0 : to.offsetLeft;
  menuBody.scrollTo({ left: left, behavior: "smooth" });

  onScrollEnd.push(() => {
    from.setAttribute("aria-hidden", "true");
    to.querySelector("[href]").focus();
  });
};

// Mise en place du menu au point zéro et aria minimal
const resetMenu = (menu) => {
  menu.querySelectorAll("div > ul.site-nav_list").forEach((list, index) => {
    list.setAttribute("aria-hidden", String(index !== 0));
  });
  menu.scrollLeft = 0;
}

/**
 * Menu Shortcuts
 */

const menuShortcutsInit = () => {
  let container = document.querySelector("#" + menuShortcutsId);

  if (container) {
    let shortcuts = container.querySelectorAll("li[data-type-link='shortcut'"),
      menuOffcanvas = document.querySelector("#" + menuOffcanvasId);

    shortcuts.forEach((shortcut) => {
      let link = shortcut.getElementsByTagName("a")[0],
        button = convertLinkToButton(shortcut, link),
        // ID du sous-menu à ouvrir
        menuId = link.getAttribute("data-menu-controls"),
        // Récupérer l'élément qui ouvre ce sous-menu dans le menu offcanvas
        offcanvasShortcut = menuOffcanvas.querySelector(
          "a[data-menu-controls=" + menuId + "]"
        ),
        // Déterminer les points de départ et d'arrivée
        subMenuPath = subMenuFromTo(offcanvasShortcut, menuOffcanvas);

      button.addEventListener("click", (event) => {
        displaySubMenu(offcanvasShortcut, subMenuPath.from, subMenuPath.to);
      });
    });
  }
};

const convertLinkToButton = (el, link) => {
  let linkHTML = link.innerHTML,
    linkAttr = link.attributes,
    button = document.createElement("button");

  if (null !== link) {
    button.innerHTML = linkHTML.trim();

    for (let index = 0; index < linkAttr.length; index++) {
      const attribute = linkAttr[index];
      if ("href" !== attribute.name) {
        button.setAttribute(attribute.name, attribute.value);
        button.setAttribute("type", "button");
        button.setAttribute("data-a11y-dialog-show", menuOffcanvasId);
      }
    }
    el.replaceChild(button, link);
  }
  return button;
};

const fraapMenuInit = () => {
  menuShortcutsInit();
  menu.offcanvas = menuOffCanvasInit();

  if (menu.offcanvas) {
    toggleState();

    menu.offcanvas.dialog.on("show", (dialogEl, dialogEvent) => {
      toggleState();
      // Désactiver le scroll en dehors du menu
      disableBodyScroll(menu.offcanvas.content);
    });

    menu.offcanvas.dialog.on("hide", (dialogEl, dialogEvent) => {
      toggleState("closing");
      menu.offcanvas.content.addEventListener(
        "transitionend",
        dialogTransitionEnd
      );
    });
  }
};

const fraapMenu = {
  init: fraapMenuInit,
};

export default fraapMenu;
