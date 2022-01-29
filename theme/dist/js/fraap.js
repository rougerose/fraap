(function () {
  'use strict';

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  // Older browsers don't support event options, feature detect it.

  // Adopted and modified solution from Bohdan Didukh (2017)
  // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

  var hasPassiveEvents = false;
  if (typeof window !== 'undefined') {
    var passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return undefined;
      }
    };
    window.addEventListener('testPassive', null, passiveTestOptions);
    window.removeEventListener('testPassive', null, passiveTestOptions);
  }

  var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);


  var locks = [];
  var documentListenerAdded = false;
  var initialClientY = -1;
  var previousBodyOverflowSetting = void 0;
  var previousBodyPosition = void 0;
  var previousBodyPaddingRight = void 0;

  // returns true if `el` should be allowed to receive touchmove events.
  var allowTouchMove = function allowTouchMove(el) {
    return locks.some(function (lock) {
      if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
        return true;
      }

      return false;
    });
  };

  var preventDefault = function preventDefault(rawEvent) {
    var e = rawEvent || window.event;

    // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.
    if (allowTouchMove(e.target)) {
      return true;
    }

    // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
    if (e.touches.length > 1) return true;

    if (e.preventDefault) e.preventDefault();

    return false;
  };

  var setOverflowHidden = function setOverflowHidden(options) {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
      var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

      if (_reserveScrollBarGap && scrollBarGap > 0) {
        var computedBodyPaddingRight = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'), 10);
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = computedBodyPaddingRight + scrollBarGap + 'px';
      }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  };

  var restoreOverflowSetting = function restoreOverflowSetting() {
    if (previousBodyPaddingRight !== undefined) {
      document.body.style.paddingRight = previousBodyPaddingRight;

      // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
      // can be set again.
      previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
      document.body.style.overflow = previousBodyOverflowSetting;

      // Restore previousBodyOverflowSetting to undefined
      // so setOverflowHidden knows it can be set again.
      previousBodyOverflowSetting = undefined;
    }
  };

  var setPositionFixed = function setPositionFixed() {
    return window.requestAnimationFrame(function () {
      // If previousBodyPosition is already set, don't set it again.
      if (previousBodyPosition === undefined) {
        previousBodyPosition = {
          position: document.body.style.position,
          top: document.body.style.top,
          left: document.body.style.left
        };

        // Update the dom inside an animation frame 
        var _window = window,
            scrollY = _window.scrollY,
            scrollX = _window.scrollX,
            innerHeight = _window.innerHeight;

        document.body.style.position = 'fixed';
        document.body.style.top = -scrollY;
        document.body.style.left = -scrollX;

        setTimeout(function () {
          return window.requestAnimationFrame(function () {
            // Attempt to check if the bottom bar appeared due to the position change
            var bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollY >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = -(scrollY + bottomBarHeight);
            }
          });
        }, 300);
      }
    });
  };

  var restorePositionSetting = function restorePositionSetting() {
    if (previousBodyPosition !== undefined) {
      // Convert the position from "px" to Int
      var y = -parseInt(document.body.style.top, 10);
      var x = -parseInt(document.body.style.left, 10);

      // Restore styles
      document.body.style.position = previousBodyPosition.position;
      document.body.style.top = previousBodyPosition.top;
      document.body.style.left = previousBodyPosition.left;

      // Restore scroll
      window.scrollTo(x, y);

      previousBodyPosition = undefined;
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
  var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
    return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
  };

  var handleScroll = function handleScroll(event, targetElement) {
    var clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
      return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
      // element is at the top of its scroll.
      return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
      // element is at the bottom of its scroll.
      return preventDefault(event);
    }

    event.stopPropagation();
    return true;
  };

  var disableBodyScroll = function disableBodyScroll(targetElement, options) {
    // targetElement must be provided
    if (!targetElement) {
      // eslint-disable-next-line no-console
      console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
      return;
    }

    // disableBodyScroll must not have been called on this targetElement before
    if (locks.some(function (lock) {
      return lock.targetElement === targetElement;
    })) {
      return;
    }

    var lock = {
      targetElement: targetElement,
      options: options || {}
    };

    locks = [].concat(_toConsumableArray(locks), [lock]);

    if (isIosDevice) {
      setPositionFixed();
    } else {
      setOverflowHidden(options);
    }

    if (isIosDevice) {
      targetElement.ontouchstart = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch.
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch.
          handleScroll(event, targetElement);
        }
      };

      if (!documentListenerAdded) {
        document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
        documentListenerAdded = true;
      }
    }
  };

  var enableBodyScroll = function enableBodyScroll(targetElement) {
    if (!targetElement) {
      // eslint-disable-next-line no-console
      console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
      return;
    }

    locks = locks.filter(function (lock) {
      return lock.targetElement !== targetElement;
    });

    if (isIosDevice) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;

      if (documentListenerAdded && locks.length === 0) {
        document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
        documentListenerAdded = false;
      }
    }

    if (isIosDevice) {
      restorePositionSetting();
    } else {
      restoreOverflowSetting();
    }
  };

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

  const nav = document.getElementById("nav");
  const navList = document.getElementById("nav-list");

  if (nav && navList) {
    let responsiveNav = new ResponsiveNav(nav, {});
    responsiveNav.init();
  }

})();
