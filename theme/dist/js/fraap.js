(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var _default = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);

      this.mAttr = 'data-' + options.dataName;
      this.mCaptureEvents = ['mouseenter', 'mouseleave'];
      this.el = options.el;
    }

    _createClass(_default, [{
      key: "mInit",
      value: function mInit(modules) {
        var _this = this;

        this.modules = modules;
        this.mCheckEventTarget = this.mCheckEventTarget.bind(this);

        if (this.events) {
          Object.keys(this.events).forEach(function (event) {
            return _this.mAddEvent(event);
          });
        }
      }
    }, {
      key: "mUpdate",
      value: function mUpdate(modules) {
        this.modules = modules;
      }
    }, {
      key: "mDestroy",
      value: function mDestroy() {
        var _this2 = this;

        if (this.events) {
          Object.keys(this.events).forEach(function (event) {
            return _this2.mRemoveEvent(event);
          });
        }
      }
    }, {
      key: "mAddEvent",
      value: function mAddEvent(event) {
        var capture = this.mCaptureEvents.includes(event) ? true : false;
        this.el.addEventListener(event, this.mCheckEventTarget, capture);
      }
    }, {
      key: "mRemoveEvent",
      value: function mRemoveEvent(event) {
        var capture = this.mCaptureEvents.includes(event) ? true : false;
        this.el.removeEventListener(event, this.mCheckEventTarget, capture);
      }
    }, {
      key: "mCheckEventTarget",
      value: function mCheckEventTarget(e) {
        var event = this.events[e.type];

        if (typeof event === "string") {
          this[event](e);
        } else {
          var data = '[' + this.mAttr + ']';
          var target = e.target;

          if (this.mCaptureEvents.includes(e.type)) {
            if (target.matches(data)) {
              this.mCallEventMethod(e, event, target);
            }
          } else {
            while (target && target !== document) {
              if (target.matches(data)) {
                if (this.mCallEventMethod(e, event, target) != 'undefined') {
                  break;
                }
              }

              target = target.parentNode;
            }
          }
        }
      }
    }, {
      key: "mCallEventMethod",
      value: function mCallEventMethod(e, event, target) {
        var name = target.getAttribute(this.mAttr);

        if (event.hasOwnProperty(name)) {
          var method = event[name];

          if (!e.hasOwnProperty('currentTarget')) {
            Object.defineProperty(e, 'currentTarget', {
              value: target
            });
          }

          if (!e.hasOwnProperty('curTarget')) {
            Object.defineProperty(e, 'curTarget', {
              value: target
            }); // For IE 11
          }

          this[method](e);
        }
      }
    }, {
      key: "$",
      value: function $(query, context) {
        var classIndex = query.indexOf('.');
        var idIndex = query.indexOf('#');
        var attrIndex = query.indexOf('[');
        var indexes = [classIndex, idIndex, attrIndex].filter(function (index) {
          return index != -1;
        });
        var index = false;
        var name = query;
        var more = '';
        var parent = this.el;

        if (indexes.length) {
          index = Math.min.apply(Math, _toConsumableArray(indexes));
          name = query.slice(0, index);
          more = query.slice(index);
        }

        if (_typeof(context) == 'object') {
          parent = context;
        }

        return parent.querySelectorAll('[' + this.mAttr + '=' + name + ']' + more);
      }
    }, {
      key: "parent",
      value: function parent(query, context) {
        var data = '[' + this.mAttr + '=' + query + ']';
        var parent = context.parentNode;

        while (parent && parent !== document) {
          if (parent.matches(data)) {
            return parent;
          }

          parent = parent.parentNode;
        }
      }
    }, {
      key: "getData",
      value: function getData(name, context) {
        var target = context || this.el;
        return target.getAttribute(this.mAttr + '-' + name);
      }
    }, {
      key: "setData",
      value: function setData(name, value, context) {
        var target = context || this.el;
        return target.setAttribute(this.mAttr + '-' + name, value);
      }
    }, {
      key: "call",
      value: function call(func, args, mod, id) {
        var _this3 = this;

        if (args && !mod) {
          mod = args;
          args = false;
        }

        if (this.modules[mod]) {
          if (id) {
            if (this.modules[mod][id]) {
              this.modules[mod][id][func](args);
            }
          } else {
            Object.keys(this.modules[mod]).forEach(function (id) {
              _this3.modules[mod][id][func](args);
            });
          }
        }
      }
    }, {
      key: "on",
      value: function on(e, mod, func, id) {
        var _this4 = this;

        if (this.modules[mod]) {
          if (id) {
            this.modules[mod][id].el.addEventListener(e, function (o) {
              return func(o);
            });
          } else {
            Object.keys(this.modules[mod]).forEach(function (i) {
              _this4.modules[mod][i].el.addEventListener(e, function (o) {
                return func(o);
              });
            });
          }
        }
      }
    }, {
      key: "init",
      value: function init() {}
    }, {
      key: "destroy",
      value: function destroy() {}
    }]);

    return _default;
  }();

  var _default$1 = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);

      this.app;
      this.modules = options.modules;
      this.currentModules = {};
      this.activeModules = {};
      this.newModules = {};
      this.moduleId = 0;
    }

    _createClass(_default, [{
      key: "init",
      value: function init(app, scope) {
        var _this = this;

        var container = scope || document;
        var elements = container.querySelectorAll('*');

        if (app && !this.app) {
          this.app = app;
        }

        this.activeModules['app'] = {
          'app': this.app
        };
        elements.forEach(function (el) {
          Array.from(el.attributes).forEach(function (i) {
            if (i.name.startsWith('data-module')) {
              var moduleExists = false;
              var dataName = i.name.split('-').splice(2);

              var moduleName = _this.toCamel(dataName);

              if (_this.modules[moduleName]) {
                moduleExists = true;
              } else if (_this.modules[_this.toUpper(moduleName)]) {
                moduleName = _this.toUpper(moduleName);
                moduleExists = true;
              }

              if (moduleExists) {
                var options = {
                  el: el,
                  name: moduleName,
                  dataName: dataName.join('-')
                };
                var module = new _this.modules[moduleName](options);
                var id = i.value;

                if (!id) {
                  _this.moduleId++;
                  id = 'm' + _this.moduleId;
                  el.setAttribute(i.name, id);
                }

                _this.addActiveModule(moduleName, id, module);

                var moduleId = moduleName + '-' + id;

                if (scope) {
                  _this.newModules[moduleId] = module;
                } else {
                  _this.currentModules[moduleId] = module;
                }
              }
            }
          });
        });
        Object.entries(this.currentModules).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              id = _ref2[0],
              module = _ref2[1];

          if (scope) {
            var split = id.split('-');
            var moduleName = split.shift();
            var moduleId = split.pop();

            _this.addActiveModule(moduleName, moduleId, module);
          } else {
            _this.initModule(module);
          }
        });
      }
    }, {
      key: "initModule",
      value: function initModule(module) {
        module.mInit(this.activeModules);
        module.init();
      }
    }, {
      key: "addActiveModule",
      value: function addActiveModule(name, id, module) {
        if (this.activeModules[name]) {
          Object.assign(this.activeModules[name], _defineProperty({}, id, module));
        } else {
          this.activeModules[name] = _defineProperty({}, id, module);
        }
      }
    }, {
      key: "update",
      value: function update(scope) {
        var _this2 = this;

        this.init(this.app, scope);
        Object.entries(this.currentModules).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2);
              _ref4[0];
              var module = _ref4[1];

          module.mUpdate(_this2.activeModules);
        });
        Object.entries(this.newModules).forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2);
              _ref6[0];
              var module = _ref6[1];

          _this2.initModule(module);
        });
        Object.assign(this.currentModules, this.newModules);
      }
    }, {
      key: "destroy",
      value: function destroy(scope) {
        if (scope) {
          this.destroyScope(scope);
        } else {
          this.destroyModules();
        }
      }
    }, {
      key: "destroyScope",
      value: function destroyScope(scope) {
        var _this3 = this;

        var elements = scope.querySelectorAll('*');
        elements.forEach(function (el) {
          Array.from(el.attributes).forEach(function (i) {
            if (i.name.startsWith('data-module')) {
              var id = i.value;
              var dataName = i.name.split('-').splice(2);
              var moduleName = _this3.toCamel(dataName) + '-' + id;
              var moduleExists = false;

              if (_this3.currentModules[moduleName]) {
                moduleExists = true;
              } else if (_this3.currentModules[_this3.toUpper(moduleName)]) {
                moduleName = _this3.toUpper(moduleName);
                moduleExists = true;
              }

              if (moduleExists) {
                _this3.destroyModule(_this3.currentModules[moduleName]);

                delete _this3.currentModules[moduleName];
              }
            }
          });
        });
        this.activeModules = {};
        this.newModules = {};
      }
    }, {
      key: "destroyModules",
      value: function destroyModules() {
        var _this4 = this;

        Object.entries(this.currentModules).forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2);
              _ref8[0];
              var module = _ref8[1];

          _this4.destroyModule(module);
        });
        this.currentModules = [];
      }
    }, {
      key: "destroyModule",
      value: function destroyModule(module) {
        module.mDestroy();
        module.destroy();
      }
    }, {
      key: "toCamel",
      value: function toCamel(arr) {
        var _this5 = this;

        return arr.reduce(function (a, b) {
          return a + _this5.toUpper(b);
        });
      }
    }, {
      key: "toUpper",
      value: function toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }]);

    return _default;
  }();

  const doc = document;

  // import { subMenuFromTo, displaySubMenu, resetMenu } from "../util/subMenu";


  // Navigation (site-header)
  class nav extends _default {
    constructor(m) {
      super(m);
      // Récupérer les raccourcis data-nav="shortcut"
      this.shortcuts = this.el.querySelectorAll('li[data-type-link="shortcut"');
    }
    init() {
      // Transformer chaque lien en bouton
      // qui ouvrira la modale contenant la navigation principale
      this.shortcuts.forEach((shortcut) => {
        let link = shortcut.children[0];

        if (link) {
          let linkHTML = link.innerHTML,
            linkAttr = link.attributes,
            button = doc.createElement("button");

          button.innerHTML = linkHTML.trim();
          for (let i = 0; i < linkAttr.length; i++) {
            const attribute = linkAttr[i];
            if ("href" !== attribute.name) {
              button.setAttribute(attribute.name, attribute.value);
              button.setAttribute("type", "button");
              button.setAttribute("data-a11y-dialog-show", "siteNavOffcanvas");
              button.setAttribute("data-nav", "button");
            }
          }
          shortcut.replaceChild(button, link);
        }
      });
    }
  }

  let onScrollTimeout = "",
    onScrollEnd = [];

  function subMenuFromTo(shortcut, container) {
    let from = shortcut.closest(".site-nav_list"),
      to = container.querySelector(new URL(shortcut.href).hash);
    return { from: from, to: to };
  }

  function displaySubMenu(shortcut, from, to) {
    let isBack = from.compareDocumentPosition(to) === 2,
      menuBody = shortcut.closest("div.site-nav_body");

    to.setAttribute("aria-hidden", "false");
    from.scrollIntoView({ inline: "start" });

    menuBody.addEventListener("scroll", onScroll, { passive: true });
    let left = isBack ? 0 : to.offsetLeft;
    menuBody.scrollTo({ left: left, behavior: "smooth" });

    onScrollEnd.push(() => {
      from.setAttribute("aria-hidden", "true");
      to.querySelector("[href]").focus();
    });
  }

  function onScroll(event) {
    clearTimeout(onScrollTimeout);
    onScrollTimeout = setTimeout(() => {
      event.target.removeEventListener("scroll", onScroll, { passive: true });
      onScrollEnd.map((fn) => {
        fn();
      });
      onScrollEnd = [];
    }, 50);
  }

  function resetMenu(menu) {
    menu.querySelectorAll("ul.site-nav_list.-variant-offcanvas").forEach((list, index) => {
      list.setAttribute("aria-hidden", String(index !== 0));
    });
    menu.scrollLeft = 0;
    onScrollEnd = [];
  }

  // Menu principal (offcanvas)

  class menu extends _default {
    constructor(m) {
      super(m);
    }

    init() {
      this.shortcuts = this.el.querySelectorAll('li[data-type-link="shortcut"] > [href][data-menu-controls]');

      this.shortcuts.forEach(shortcut => {
        let submenuPath = subMenuFromTo(shortcut, this.el);

        shortcut.addEventListener("click", (event) => {
          event.preventDefault();
          displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
        });
      });

      resetMenu(this.el);
    }

  }

  const not = {
    inert: ':not([inert]):not([inert] *)',
    negTabIndex: ':not([tabindex^="-"])',
    disabled: ':not(:disabled)',
  };

  var focusableSelectors = [
    `a[href]${not.inert}${not.negTabIndex}`,
    `area[href]${not.inert}${not.negTabIndex}`,
    `input:not([type="hidden"]):not([type="radio"])${not.inert}${not.negTabIndex}${not.disabled}`,
    `input[type="radio"]${not.inert}${not.negTabIndex}${not.disabled}`,
    `select${not.inert}${not.negTabIndex}${not.disabled}`,
    `textarea${not.inert}${not.negTabIndex}${not.disabled}`,
    `button${not.inert}${not.negTabIndex}${not.disabled}`,
    `details${not.inert} > summary:first-of-type${not.negTabIndex}`,
    // Discard until Firefox supports `:has()`
    // See: https://github.com/KittyGiraudel/focusable-selectors/issues/12
    // `details:not(:has(> summary))${not.inert}${not.negTabIndex}`,
    `iframe${not.inert}${not.negTabIndex}`,
    `audio[controls]${not.inert}${not.negTabIndex}`,
    `video[controls]${not.inert}${not.negTabIndex}`,
    `[contenteditable]${not.inert}${not.negTabIndex}`,
    `[tabindex]${not.inert}${not.negTabIndex}`,
  ];

  /**
   * Set the focus to the first element with `autofocus` with the element or the
   * element itself.
   */
  function moveFocusToDialog(el) {
      const focused = (el.querySelector('[autofocus]') || el);
      focused.focus();
  }
  /**
   * Get the first and last focusable elements in a given tree.
   */
  function getFocusableEdges(el) {
      // Check for a focusable element within the subtree of `el`.
      const first = findFocusableElement(el, true);
      // Only if we find the first element do we need to look for the last one. If
      // there’s no last element, we set `last` as a reference to `first` so that
      // the returned array is always of length 2.
      const last = first ? findFocusableElement(el, false) || first : null;
      return [first, last];
  }
  /**
   * Find the first focusable element inside the given node if `forward` is truthy
   * or the last focusable element otherwise.
   */
  function findFocusableElement(node, forward) {
      // If we’re walking forward, check if this node is focusable, and return it
      // immediately if it is.
      if (forward && isFocusable(node))
          return node;
      // We should only search the subtree of this node if it can have focusable
      // children.
      if (canHaveFocusableChildren(node)) {
          // Start walking the DOM tree, looking for focusable elements.
          // Case 1: If this node has a shadow root, search it recursively.
          if (node.shadowRoot) {
              // Descend into this subtree.
              let next = getNextChildEl(node.shadowRoot, forward);
              // Traverse siblings, searching the subtree of each one
              // for focusable elements.
              while (next) {
                  const focusableEl = findFocusableElement(next, forward);
                  if (focusableEl)
                      return focusableEl;
                  next = getNextSiblingEl(next, forward);
              }
          }
          // Case 2: If this node is a slot for a Custom Element, search its assigned
          // nodes recursively.
          else if (node.localName === 'slot') {
              const assignedElements = node.assignedElements({
                  flatten: true,
              });
              if (!forward)
                  assignedElements.reverse();
              for (const assignedElement of assignedElements) {
                  const focusableEl = findFocusableElement(assignedElement, forward);
                  if (focusableEl)
                      return focusableEl;
              }
          }
          // Case 3: this is a regular Light DOM node. Search its subtree.
          else {
              // Descend into this subtree.
              let next = getNextChildEl(node, forward);
              // Traverse siblings, searching the subtree of each one
              // for focusable elements.
              while (next) {
                  const focusableEl = findFocusableElement(next, forward);
                  if (focusableEl)
                      return focusableEl;
                  next = getNextSiblingEl(next, forward);
              }
          }
      }
      // If we’re walking backward, we want to check the node’s entire subtree
      // before checking the node itself. If this node is focusable, return it.
      if (!forward && isFocusable(node))
          return node;
      return null;
  }
  function getNextChildEl(node, forward) {
      return forward ? node.firstElementChild : node.lastElementChild;
  }
  function getNextSiblingEl(el, forward) {
      return forward ? el.nextElementSibling : el.previousElementSibling;
  }
  /**
   * Determine if an element is hidden from the user.
   */
  const isHidden = (el) => {
      // Browsers hide all non-<summary> descendants of closed <details> elements
      // from user interaction, but those non-<summary> elements may still match our
      // focusable-selectors and may still have dimensions, so we need a special
      // case to ignore them.
      if (el.matches('details:not([open]) *') &&
          !el.matches('details>summary:first-of-type'))
          return true;
      // If this element has no painted dimensions, it's hidden.
      return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  };
  /**
   * Determine if an element is focusable and has user-visible painted dimensions.
   */
  const isFocusable = (el) => {
      // A shadow host that delegates focus will never directly receive focus,
      // even with `tabindex=0`. Consider our <fancy-button> custom element, which
      // delegates focus to its shadow button:
      //
      // <fancy-button tabindex="0">
      //  #shadow-root
      //  <button><slot></slot></button>
      // </fancy-button>
      //
      // The browser acts as as if there is only one focusable element – the shadow
      // button. Our library should behave the same way.
      if (el.shadowRoot?.delegatesFocus)
          return false;
      return el.matches(focusableSelectors.join(',')) && !isHidden(el);
  };
  /**
   * Determine if an element can have focusable children. Useful for bailing out
   * early when walking the DOM tree.
   * @example
   * This div is inert, so none of its children can be focused, even though they
   * meet our criteria for what is focusable. Once we check the div, we can skip
   * the rest of the subtree.
   * ```html
   * <div inert>
   *   <button>Button</button>
   *   <a href="#">Link</a>
   * </div>
   * ```
   */
  function canHaveFocusableChildren(el) {
      // The browser will never send focus into a Shadow DOM if the host element
      // has a negative tabindex. This applies to both slotted Light DOM Shadow DOM
      // children
      if (el.shadowRoot && el.getAttribute('tabindex') === '-1')
          return false;
      // Elemments matching this selector are either hidden entirely from the user,
      // or are visible but unavailable for interaction. Their descentants can never
      // receive focus.
      return !el.matches(':disabled,[hidden],[inert]');
  }
  /**
   * Get the active element, accounting for Shadow DOM subtrees.
   * @author Cory LaViska
   * @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
   */
  function getActiveElement(root = document) {
      const activeEl = root.activeElement;
      if (!activeEl)
          return null;
      // If there’s a shadow root, recursively find the active element within it.
      // If the recursive call returns null, return the active element
      // of the top-level Document.
      if (activeEl.shadowRoot)
          return getActiveElement(activeEl.shadowRoot) || document.activeElement;
      // If not, we can just return the active element
      return activeEl;
  }
  /**
   * Trap the focus inside the given element
   */
  function trapTabKey(el, event) {
      const [firstFocusableChild, lastFocusableChild] = getFocusableEdges(el);
      // If there are no focusable children in the dialog, prevent the user from
      // tabbing out of it
      if (!firstFocusableChild)
          return event.preventDefault();
      const activeElement = getActiveElement();
      // If the SHIFT key is pressed while tabbing (moving backwards) and the
      // currently focused item is the first one, move the focus to the last
      // focusable item from the dialog element
      if (event.shiftKey && activeElement === firstFocusableChild) {
          // @ts-ignore: we know that `lastFocusableChild` is not null here
          lastFocusableChild.focus();
          event.preventDefault();
      }
      // If the SHIFT key is not pressed (moving forwards) and the currently focused
      // item is the last one, move the focus to the first focusable item from the
      // dialog element
      else if (!event.shiftKey && activeElement === lastFocusableChild) {
          firstFocusableChild.focus();
          event.preventDefault();
      }
  }

  class A11yDialog {
      $el;
      id;
      previouslyFocused;
      shown;
      constructor(element) {
          this.$el = element;
          this.id = this.$el.getAttribute('data-a11y-dialog') || this.$el.id;
          this.previouslyFocused = null;
          this.shown = false;
          this.maintainFocus = this.maintainFocus.bind(this);
          this.bindKeypress = this.bindKeypress.bind(this);
          this.handleTriggerClicks = this.handleTriggerClicks.bind(this);
          this.show = this.show.bind(this);
          this.hide = this.hide.bind(this);
          this.$el.setAttribute('aria-hidden', 'true');
          this.$el.setAttribute('aria-modal', 'true');
          this.$el.setAttribute('tabindex', '-1');
          if (!this.$el.hasAttribute('role')) {
              this.$el.setAttribute('role', 'dialog');
          }
          document.addEventListener('click', this.handleTriggerClicks, true);
      }
      /**
       * Destroy the current instance (after making sure the dialog has been hidden)
       * and remove all associated listeners from dialog openers and closers
       */
      destroy() {
          // Hide the dialog to avoid destroying an open instance
          this.hide();
          // Remove the click event delegates for our openers and closers
          document.removeEventListener('click', this.handleTriggerClicks, true);
          // Clone and replace the dialog element to prevent memory leaks caused by
          // event listeners that the author might not have cleaned up.
          this.$el.replaceWith(this.$el.cloneNode(true));
          // Dispatch a `destroy` event
          this.fire('destroy');
          return this;
      }
      /**
       * Show the dialog element, trap the current focus within it, listen for some
       * specific key presses and fire all registered callbacks for `show` event
       */
      show(event) {
          // If the dialog is already open, abort
          if (this.shown)
              return this;
          // Keep a reference to the currently focused element to be able to restore
          // it later
          this.shown = true;
          this.$el.removeAttribute('aria-hidden');
          this.previouslyFocused = getActiveElement();
          // Due to a long lasting bug in Safari, clicking an interactive element
          // (like a <button>) does *not* move the focus to that element, which means
          // `document.activeElement` is whatever element is currently focused (like
          // an <input>), or the <body> element otherwise. We can work around that
          // problem by checking whether the focused element is the <body>, and if it,
          // store the click event target.
          // See: https://bugs.webkit.org/show_bug.cgi?id=22261
          if (this.previouslyFocused?.tagName === 'BODY' && event?.target) {
              this.previouslyFocused = event.target;
          }
          // Set the focus to the dialog element
          // See: https://github.com/KittyGiraudel/a11y-dialog/pull/583
          if (event?.type === 'focus') {
              this.maintainFocus(event);
          }
          else {
              moveFocusToDialog(this.$el);
          }
          // Bind a focus event listener to the body element to make sure the focus
          // stays trapped inside the dialog while open, and start listening for some
          // specific key presses (TAB and ESC)
          document.body.addEventListener('focus', this.maintainFocus, true);
          this.$el.addEventListener('keydown', this.bindKeypress, true);
          // Dispatch a `show` event
          this.fire('show', event);
          return this;
      }
      /**
       * Hide the dialog element, restore the focus to the previously active
       * element, stop listening for some specific key presses and fire all
       * registered callbacks for `hide` event
       */
      hide(event) {
          // If the dialog is already closed, abort
          if (!this.shown)
              return this;
          this.shown = false;
          this.$el.setAttribute('aria-hidden', 'true');
          this.previouslyFocused?.focus?.();
          // Remove the focus event listener to the body element and stop listening
          // for specific key presses
          document.body.removeEventListener('focus', this.maintainFocus, true);
          this.$el.removeEventListener('keydown', this.bindKeypress, true);
          // Dispatch a `hide` event
          this.fire('hide', event);
          return this;
      }
      /**
       * Register a new callback for the given event type
       */
      on(type, handler, options) {
          this.$el.addEventListener(type, handler, options);
          return this;
      }
      /**
       * Unregister an existing callback for the given event type
       */
      off(type, handler, options) {
          this.$el.removeEventListener(type, handler, options);
          return this;
      }
      /**
       * Dispatch a custom event from the DOM element associated with this dialog.
       * This allows authors to listen for and respond to the events in their own
       * code
       */
      fire(type, event) {
          this.$el.dispatchEvent(new CustomEvent(type, {
              detail: event,
              cancelable: true,
          }));
      }
      /**
       * Add a delegated event listener for when elememts that open or close the
       * dialog are clicked, and call `show` or `hide`, respectively
       */
      handleTriggerClicks(event) {
          const target = event.target;
          // We use `.closest(..)` and not `.matches(..)` here so that clicking
          // an element nested within a dialog opener does cause the dialog to open
          if (target.closest(`[data-a11y-dialog-show="${this.id}"]`)) {
              this.show(event);
          }
          if (target.closest(`[data-a11y-dialog-hide="${this.id}"]`) ||
              (target.closest('[data-a11y-dialog-hide]') &&
                  target.closest('[aria-modal="true"]') === this.$el)) {
              this.hide(event);
          }
      }
      /**
       * Private event handler used when listening to some specific key presses
       * (namely ESC and TAB)
       */
      bindKeypress(event) {
          // This is an escape hatch in case there are nested open dialogs, so that
          // only the top most dialog gets interacted with
          if (document.activeElement?.closest('[aria-modal="true"]') !== this.$el) {
              return;
          }
          let hasOpenPopover = false;
          try {
              hasOpenPopover = !!this.$el.querySelector('[popover]:not([popover="manual"]):popover-open');
          }
          catch {
              // Run that DOM query in a try/catch because not all browsers support the
              // `:popover-open` selector, which would cause the whole expression to
              // fail
              // See: https://caniuse.com/mdn-css_selectors_popover-open
              // See: https://github.com/KittyGiraudel/a11y-dialog/pull/578#discussion_r1343215149
          }
          // If the dialog is shown and the ESC key is pressed, prevent any further
          // effects from the ESC key and hide the dialog, unless:
          // - its role is `alertdialog`, which means it should be modal
          // - or it contains an open popover, in which case ESC should close it
          if (event.key === 'Escape' &&
              this.$el.getAttribute('role') !== 'alertdialog' &&
              !hasOpenPopover) {
              event.preventDefault();
              this.hide(event);
          }
          // If the dialog is shown and the TAB key is pressed, make sure the focus
          // stays trapped within the dialog element
          if (event.key === 'Tab') {
              trapTabKey(this.$el, event);
          }
      }
      /**
       * If the dialog is shown and the focus is not within a dialog element (either
       * this one or another one in case of nested dialogs) or attribute, move it
       * back to the dialog container
       * See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
       */
      maintainFocus(event) {
          const target = event.target;
          if (!target.closest('[aria-modal="true"], [data-a11y-dialog-ignore-focus-trap]')) {
              moveFocusToDialog(this.$el);
          }
      }
  }

  function instantiateDialogs() {
      for (const el of document.querySelectorAll('[data-a11y-dialog]')) {
          new A11yDialog(el);
      }
  }
  if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', instantiateDialogs);
      }
      else {
          instantiateDialogs();
      }
  }

  /**
   * name: body-scroll-lock-upgrade
   * version: v1.1.0
   * author: Rick.li
   */
  let hasPassiveEvents = false;
  if (typeof window !== "undefined") {
    const passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return void 0;
      }
    };
    window.addEventListener("testPassive", null, passiveTestOptions);
    window.removeEventListener("testPassive", null, passiveTestOptions);
  }
  const isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  let locks = [];
  let locksIndex = /* @__PURE__ */ new Map();
  let documentListenerAdded = false;
  let initialClientY = -1;
  let previousBodyOverflowSetting;
  let htmlStyle;
  let bodyStyle;
  let previousBodyPaddingRight;
  const allowTouchMove = (el) => locks.some((lock) => {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }
    return false;
  });
  const preventDefault = (rawEvent) => {
    const e = rawEvent || window.event;
    if (allowTouchMove(e.target)) {
      return true;
    }
    if (e.touches.length > 1)
      return true;
    if (e.preventDefault)
      e.preventDefault();
    return false;
  };
  const setOverflowHidden = (options) => {
    if (previousBodyPaddingRight === void 0) {
      const reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      const scrollBarGap = window.innerWidth - document.documentElement.getBoundingClientRect().width;
      if (reserveScrollBarGap && scrollBarGap > 0) {
        const computedBodyPaddingRight = parseInt(
          window.getComputedStyle(document.body).getPropertyValue("padding-right"),
          10
        );
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = `${computedBodyPaddingRight + scrollBarGap}px`;
      }
    }
    if (previousBodyOverflowSetting === void 0) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  };
  const restoreOverflowSetting = () => {
    if (previousBodyPaddingRight !== void 0) {
      document.body.style.paddingRight = previousBodyPaddingRight;
      previousBodyPaddingRight = void 0;
    }
    if (previousBodyOverflowSetting !== void 0) {
      document.body.style.overflow = previousBodyOverflowSetting;
      previousBodyOverflowSetting = void 0;
    }
  };
  const setPositionFixed = () => window.requestAnimationFrame(() => {
    const $html = document.documentElement;
    const $body = document.body;
    if (bodyStyle === void 0) {
      htmlStyle = { ...$html.style };
      bodyStyle = { ...$body.style };
      const { scrollY, scrollX, innerHeight } = window;
      $html.style.height = "100%";
      $html.style.overflow = "hidden";
      $body.style.position = "fixed";
      $body.style.top = `${-scrollY}px`;
      $body.style.left = `${-scrollX}px`;
      $body.style.width = "100%";
      $body.style.height = "auto";
      $body.style.overflow = "hidden";
      setTimeout(
        () => window.requestAnimationFrame(() => {
          const bottomBarHeight = innerHeight - window.innerHeight;
          if (bottomBarHeight && scrollY >= innerHeight) {
            $body.style.top = -(scrollY + bottomBarHeight) + "px";
          }
        }),
        300
      );
    }
  });
  const restorePositionSetting = () => {
    if (bodyStyle !== void 0) {
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);
      const $html = document.documentElement;
      const $body = document.body;
      $html.style.height = (htmlStyle == null ? void 0 : htmlStyle.height) || "";
      $html.style.overflow = (htmlStyle == null ? void 0 : htmlStyle.overflow) || "";
      $body.style.position = bodyStyle.position || "";
      $body.style.top = bodyStyle.top || "";
      $body.style.left = bodyStyle.left || "";
      $body.style.width = bodyStyle.width || "";
      $body.style.height = bodyStyle.height || "";
      $body.style.overflow = bodyStyle.overflow || "";
      window.scrollTo(x, y);
      bodyStyle = void 0;
    }
  };
  const isTargetElementTotallyScrolled = (targetElement) => targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
  const handleScroll = (event, targetElement) => {
    const clientY = event.targetTouches[0].clientY - initialClientY;
    if (allowTouchMove(event.target)) {
      return false;
    }
    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
      return preventDefault(event);
    }
    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
      return preventDefault(event);
    }
    event.stopPropagation();
    return true;
  };
  const disableBodyScroll = (targetElement, options) => {
    if (!targetElement) {
      console.error(
        "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices."
      );
      return;
    }
    locksIndex.set(
      targetElement,
      (locksIndex == null ? void 0 : locksIndex.get(targetElement)) ? (locksIndex == null ? void 0 : locksIndex.get(targetElement)) + 1 : 1
    );
    if (locks.some((lock2) => lock2.targetElement === targetElement)) {
      return;
    }
    const lock = {
      targetElement,
      options: options || {}
    };
    locks = [...locks, lock];
    if (isIosDevice) {
      setPositionFixed();
    } else {
      setOverflowHidden(options);
    }
    if (isIosDevice) {
      targetElement.ontouchstart = (event) => {
        if (event.targetTouches.length === 1) {
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = (event) => {
        if (event.targetTouches.length === 1) {
          handleScroll(event, targetElement);
        }
      };
      if (!documentListenerAdded) {
        document.addEventListener(
          "touchmove",
          preventDefault,
          hasPassiveEvents ? { passive: false } : void 0
        );
        documentListenerAdded = true;
      }
    }
  };
  const enableBodyScroll = (targetElement) => {
    if (!targetElement) {
      console.error(
        "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices."
      );
      return;
    }
    locksIndex.set(
      targetElement,
      (locksIndex == null ? void 0 : locksIndex.get(targetElement)) ? (locksIndex == null ? void 0 : locksIndex.get(targetElement)) - 1 : 0
    );
    if ((locksIndex == null ? void 0 : locksIndex.get(targetElement)) === 0) {
      locks = locks.filter((lock) => lock.targetElement !== targetElement);
      locksIndex == null ? void 0 : locksIndex.delete(targetElement);
    }
    if (isIosDevice) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;
      if (documentListenerAdded && locks.length === 0) {
        document.removeEventListener(
          "touchmove",
          preventDefault,
          hasPassiveEvents ? { passive: false } : void 0
        );
        documentListenerAdded = false;
      }
    }
    if (locks.length === 0) {
      if (isIosDevice) {
        restorePositionSetting();
      } else {
        restoreOverflowSetting();
      }
    }
  };

  class dialog extends _default {
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
  }

  /**
   * Serialize form fields into key / value pairs.
   * @link https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js
   * @param {FormData} formData
   * @returns {Object}
   */
  function serializeFormData(formData) {
    let obj = {};
    for (const [key, value] of formData) {
      // const resetKeys = ["formulaire_action_args", "formulaire_action_sign"];

      // If the key contains brackets, it's an array.
      if (key.indexOf("[]") !== -1) {
        const k = key.replace(/[\[\]]+/g, "");
        if (!obj.hasOwnProperty(k)) {
          obj[k] = [];
        }
        if (value !== "") {
          obj[k].push(value);
        }
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  // Ce module prend en charge les filtres disponibles
  // pour un contenu (recherche, médiathèque, etc.).
  class filters extends _default {
    constructor(m) {
      super(m);

      this.options = {
        ajaxTarget: {
          filters: "filtres",
          content: ""
        }
      };

      this.events = {
        change: {
          filters: "updateFilters"
        }
      };
    }

    // TODO A supprimer ?
    // checkInitStateFilters() {
    //   let needUpdate = false;
    //   const formData = this.getFormData();
    //   const ignoreKeys = [
    //     "var_ajax",
    //     "formulaire_action",
    //     "formulaire_action_args",
    //     "formulaire_action_sign"
    //   ];

    //   for (const key in formData) {
    //     if (!ignoreKeys.includes(key) && formData[key]) {
    //       needUpdate = true;
    //     }
    //   }
    //   if (needUpdate) {
    //     this.updateFilters();
    //   }
    // }

    closeDialog() {
      this.form[0].removeEventListener("submit", this.submitForm);
      this.call("close", "", "dialog", this.dialogModuleId);
    }


    getFormData() {
      let formData = new FormData(this.form[0]);

      // l'API FormData n'envoie pas les champs vides tels
      // que les checkbox mots[]. Ce comportement entraîne
      // un problème au rechargement du formulaire via ajax :
      // un checkbox coché puis décoché reste coché...
      // Par conséquent, on ajoute tous les paramètres principaux,
      // même s'ils sont vides.
      for (const input of this.mainInputs) {
        if (!formData.has(input)) {
          formData.set(input, "");
        }
      }

      let formObj = serializeFormData(formData);
      // console.log(formObj);
      return formObj;
    }

    // remoteUpdateFilters(checkedInputs) {

    // }

    /**
     * Mettre à jour, via ajaxReload, le bloc du contenu principal
     * de la page. L'url de la page est mise à jour (history: true).
     * @param {Boolean} closeDialog Fermer ou non le dialog des filtres
     */
    updateContent(closeDialog) {
      let formData = this.getFormData(),
        acceptKeys = ["type_ref", "mots", "typologie", "annee", "departements", "regions"],
        argObj = {},
        closeCB = closeDialog || false;

      for (let key in formData) {
        if (formData.hasOwnProperty(key) && acceptKeys.includes(key)) {
          // Conserver uniquement les valeurs de type array et string non vide
          // Sinon elles ne sont pas supprimées de l'url.
          if (formData[key] === "") {
            argObj[key] = null;
          } else {
            argObj[key] = formData[key];
          }
        }
      }

      window.ajaxReload(this.options.ajaxTarget.content, {
        callback: () => {
          if (closeCB) this.closeDialog();
        },
        args: argObj,
        history: true,
      });

    }

    updateFilters() {
      this.form[0].removeEventListener("submit", this.submitForm);

      window.ajaxReload(this.options.ajaxTarget.filters, {
        callback: () => {
          this.updateForm();
          this.call("update", "", "collapsible", this.collapsibleModuleIdId);
        },
        args: this.getFormData(),
      });

      this.updateContent(false);
    }

    updateForm() {
      this.form[0].addEventListener("submit", this.submitForm);
    }

    submitForm(event) {
      event.preventDefault();
      this.updateContent(true);
    }

    init() {
      this.form = this.el.getElementsByTagName("form");

      this.submitForm = this.submitForm.bind(this);

      // Récupérer le nom du bloc ajax du contenu principal
      this.options.ajaxTarget.content = this.getData("content");

      // Mémoriser l'id du dialog parent qui sera télécommandé par closeDialog()
      this.dialogModuleId = this.el.parentNode.closest("[data-module-dialog]").getAttribute("data-module-dialog");

      // Mémoriser l'id du module collapsible lié aux filtres
      this.collapsibleModuleId = this.el.getAttribute("data-module-collapsible");

      // Identifier et mémoriser les filtres utilisés
      let names = ["btnOpen[]", "mots[]", "departements[]", "regions[]", "type_ref", "typologie", "annee"];

      this.mainInputs = [];

      for (const item of this.form[0]) {
        if (names.includes(item.name) && !this.mainInputs.includes(item.name)) {
          this.mainInputs.push(item.name);
        }
      }

      // this.checkInitStateFilters();
      this.updateForm();
    }
  }

  /**
   * Ce module prend en charge les boutons de suppression
   * des filtres éventuellement cochés par l'utilisateur
   * pour les pages Annuaire des membres.
   * A noter que ces boutons sont logés dans un conteneur ajax
   * différent des filtres, raison pour laquelle ils sont gérés séparemment.
   */
  class resetfilters extends _default {
    constructor(m) {
      super(m);

      this.events = {
        click: {
          button: "resetFilters",
        }
      };
    }

    resetFilters() {
      event.preventDefault(event);
      const params = event.currentTarget.search;
      let optionsAjax = {
        callback: () => {
            this.call("updateFilters", "", "filters");
          },
          args: {},
          history: true,
          href: "",
      };
      console.log("options", optionsAjax);

      if (params) {
        // Le bouton de suppression sélectionné contient encore
        // des paramètres regions, deparements, mots ou recherche.
        const urlParams = new URLSearchParams(params);
        const entries = urlParams.entries();
        let argsObj = {};

        for (const entry of entries) {
          const key = entry[0],
            value = entry[1];

          // If the key contains brackets, it's an array.
          if (key.indexOf("[]") !== -1) {
            let k = key.replace(/[\[\]]+/g, "");

            if (!argsObj.hasOwnProperty(k)) {
              argsObj[k] = [];
            }

            if (value !== "") {
              argsObj[k].push(value);
            }
          } else {
            if (key == "recherche" && value == "") {
              console.log(key, value);
              optionsAjax.history = false;
            } else {
              argsObj[key] = value;
            }
          }
        }

        optionsAjax = {
          callback: () => {
            this.call("updateFilters", "", "filters");
          },
          args: argsObj,
          history: true,
          href: "",
        };

      } else {
        // le bouton ne contient aucun paramètre -> url de départ de la rubrique
        const href = event.currentTarget.href;
        const url = new URL(href);

        // formulaire de recherche rubrique
        const search = document.querySelector(".formulaire_recherche_rubrique input[type='search']");
        if (search && search.value) {
          search.value = "";
        }

        // optionsAjax = {
        //   callback: () => {
        //     this.call("updateFilters", "", "filters");
        //   },
        //   args: {},
        //   history: true,
        //   href: url.origin + url.pathname,
        // };

        optionsAjax.args = {};
        optionsAjax.history = false;
        optionsAjax.href = url.origin + url.pathname;

        // On relance le bloc ajax "filtres" qui contient le formulaire.
        // Le callback met à jour le contenu du formulaire lui-même.
        // window.ajaxReload("filtres", {
        //   href: url.origin + url.pathname,
        //   callback: () => {
        //     this.call("updateFilters", "", "filters");
        //   },
        //   args: {},
        //   history: true,
        // });
      }
      // TODO : vérifier si optionsAjax contient des données ?
      console.log(optionsAjax);
      // On relance le bloc ajax "filtres" qui contient le formulaire.
      // Le callback met à jour le contenu du formulaire lui-même.
        window.ajaxReload("filtres", optionsAjax);
    }
  }

  // Menu principal (offcanvas)

  class collapsible extends _default {
    constructor(m) {
      super(m);

      this.options = {
        extendMode: (this.getData("extendmode") === "1") || false,
      };

      this.events = {
        click: {
          header: "toggleSectionCollapsible"
        }
      };
    }

      /**
     * Afficher sous forme textuelle les choix de l'utilisateur.
     * @param {Element} button
     * @param {Array} inputs
     */
    displayUserChoice(button, inputs) {
      let labels = [];
      for (const input of inputs) {
        labels.push(input.dataset.label);
      }

      if (labels.length > 0) {
        let span, labelText;
        span = doc.createElement("span");
        labelText = doc.createTextNode(labels.join(", "));

        span.appendChild(labelText);
        span.classList.add("collapsible_user-choice");
        button.firstElementChild.appendChild(span);
      }
    }

    toggleSectionCollapsible(event) {
      const target = event.currentTarget;
      const section = this.parent("section", target);
      const body = this.$("body", section);
      const button = target.querySelector("button");
      const hiddenInput = target.querySelector('input[name="btnOpen[]"]');

      // Statut de l'accordéon avant le clic et non après
      let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

      // 1- Basculer l'état du bouton
      button.setAttribute("aria-expanded", !isExpanded);

      // 2- Basculer la visibilité du contenu
      body[0].hidden = isExpanded;

      // 3- Mémoriser le nouvel état du bouton
      if (this.options.extendMode) {
        if (!isExpanded) {
          hiddenInput.setAttribute("value", button.id);
        } else {
          hiddenInput.setAttribute("value", "");
        }
      }

      if (this.options.extendMode) {
        // Récupérer le <span> qui affiche le choix de l'utilisateur.
        let userChoice = button.querySelector("span.collapsible_user-choice");

        // S'il existe, le supprimer à l'ouverture de l'accordéon
        if (userChoice) {
          userChoice.parentNode.removeChild(userChoice);
        }

        // Si le bouton est ouvert et si l'utilisateur le referme
        if (isExpanded) {
          // Récupérer les cases cochées
          let inputs = body[0].querySelectorAll("input:checked");

          // Mettre à jour la liste des choix.
          if (inputs.length > 0) {
            this.displayUserChoice(button, inputs);
          }
        }
      }
    }

    update() {
      if (this.options.extendMode) {
        let sections = this.$("section");
        sections.forEach((section) => {
          const button = section.querySelector("button");
          const body = this.$("body", section);
          const inputs = body[0].querySelectorAll("input:checked");

          let isExpanded = button.getAttribute("aria-expanded") == "true" || false;

          if (isExpanded === false && inputs.length > 0) {
            this.displayUserChoice(button, inputs);
          }
        });
      }
    }

    init() {
      this.update();

    }

  }

  var modules = /*#__PURE__*/Object.freeze({
    __proto__: null,
    collapsible: collapsible,
    dialog: dialog,
    filters: filters,
    menu: menu,
    nav: nav,
    resetfilters: resetfilters
  });

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var smoothscroll$1 = {exports: {}};

  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */

  (function (module, exports) {
  	(function () {

  	  // polyfill
  	  function polyfill() {
  	    // aliases
  	    var w = window;
  	    var d = document;

  	    // return if scroll behavior is supported and polyfill is not forced
  	    if (
  	      'scrollBehavior' in d.documentElement.style &&
  	      w.__forceSmoothScrollPolyfill__ !== true
  	    ) {
  	      return;
  	    }

  	    // globals
  	    var Element = w.HTMLElement || w.Element;
  	    var SCROLL_TIME = 468;

  	    // object gathering original scroll methods
  	    var original = {
  	      scroll: w.scroll || w.scrollTo,
  	      scrollBy: w.scrollBy,
  	      elementScroll: Element.prototype.scroll || scrollElement,
  	      scrollIntoView: Element.prototype.scrollIntoView
  	    };

  	    // define timing method
  	    var now =
  	      w.performance && w.performance.now
  	        ? w.performance.now.bind(w.performance)
  	        : Date.now;

  	    /**
  	     * indicates if a the current browser is made by Microsoft
  	     * @method isMicrosoftBrowser
  	     * @param {String} userAgent
  	     * @returns {Boolean}
  	     */
  	    function isMicrosoftBrowser(userAgent) {
  	      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

  	      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
  	    }

  	    /*
  	     * IE has rounding bug rounding down clientHeight and clientWidth and
  	     * rounding up scrollHeight and scrollWidth causing false positives
  	     * on hasScrollableSpace
  	     */
  	    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

  	    /**
  	     * changes scroll position inside an element
  	     * @method scrollElement
  	     * @param {Number} x
  	     * @param {Number} y
  	     * @returns {undefined}
  	     */
  	    function scrollElement(x, y) {
  	      this.scrollLeft = x;
  	      this.scrollTop = y;
  	    }

  	    /**
  	     * returns result of applying ease math function to a number
  	     * @method ease
  	     * @param {Number} k
  	     * @returns {Number}
  	     */
  	    function ease(k) {
  	      return 0.5 * (1 - Math.cos(Math.PI * k));
  	    }

  	    /**
  	     * indicates if a smooth behavior should be applied
  	     * @method shouldBailOut
  	     * @param {Number|Object} firstArg
  	     * @returns {Boolean}
  	     */
  	    function shouldBailOut(firstArg) {
  	      if (
  	        firstArg === null ||
  	        typeof firstArg !== 'object' ||
  	        firstArg.behavior === undefined ||
  	        firstArg.behavior === 'auto' ||
  	        firstArg.behavior === 'instant'
  	      ) {
  	        // first argument is not an object/null
  	        // or behavior is auto, instant or undefined
  	        return true;
  	      }

  	      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
  	        // first argument is an object and behavior is smooth
  	        return false;
  	      }

  	      // throw error when behavior is not supported
  	      throw new TypeError(
  	        'behavior member of ScrollOptions ' +
  	          firstArg.behavior +
  	          ' is not a valid value for enumeration ScrollBehavior.'
  	      );
  	    }

  	    /**
  	     * indicates if an element has scrollable space in the provided axis
  	     * @method hasScrollableSpace
  	     * @param {Node} el
  	     * @param {String} axis
  	     * @returns {Boolean}
  	     */
  	    function hasScrollableSpace(el, axis) {
  	      if (axis === 'Y') {
  	        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
  	      }

  	      if (axis === 'X') {
  	        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
  	      }
  	    }

  	    /**
  	     * indicates if an element has a scrollable overflow property in the axis
  	     * @method canOverflow
  	     * @param {Node} el
  	     * @param {String} axis
  	     * @returns {Boolean}
  	     */
  	    function canOverflow(el, axis) {
  	      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

  	      return overflowValue === 'auto' || overflowValue === 'scroll';
  	    }

  	    /**
  	     * indicates if an element can be scrolled in either axis
  	     * @method isScrollable
  	     * @param {Node} el
  	     * @param {String} axis
  	     * @returns {Boolean}
  	     */
  	    function isScrollable(el) {
  	      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
  	      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

  	      return isScrollableY || isScrollableX;
  	    }

  	    /**
  	     * finds scrollable parent of an element
  	     * @method findScrollableParent
  	     * @param {Node} el
  	     * @returns {Node} el
  	     */
  	    function findScrollableParent(el) {
  	      while (el !== d.body && isScrollable(el) === false) {
  	        el = el.parentNode || el.host;
  	      }

  	      return el;
  	    }

  	    /**
  	     * self invoked function that, given a context, steps through scrolling
  	     * @method step
  	     * @param {Object} context
  	     * @returns {undefined}
  	     */
  	    function step(context) {
  	      var time = now();
  	      var value;
  	      var currentX;
  	      var currentY;
  	      var elapsed = (time - context.startTime) / SCROLL_TIME;

  	      // avoid elapsed times higher than one
  	      elapsed = elapsed > 1 ? 1 : elapsed;

  	      // apply easing to elapsed time
  	      value = ease(elapsed);

  	      currentX = context.startX + (context.x - context.startX) * value;
  	      currentY = context.startY + (context.y - context.startY) * value;

  	      context.method.call(context.scrollable, currentX, currentY);

  	      // scroll more if we have not reached our destination
  	      if (currentX !== context.x || currentY !== context.y) {
  	        w.requestAnimationFrame(step.bind(w, context));
  	      }
  	    }

  	    /**
  	     * scrolls window or element with a smooth behavior
  	     * @method smoothScroll
  	     * @param {Object|Node} el
  	     * @param {Number} x
  	     * @param {Number} y
  	     * @returns {undefined}
  	     */
  	    function smoothScroll(el, x, y) {
  	      var scrollable;
  	      var startX;
  	      var startY;
  	      var method;
  	      var startTime = now();

  	      // define scroll context
  	      if (el === d.body) {
  	        scrollable = w;
  	        startX = w.scrollX || w.pageXOffset;
  	        startY = w.scrollY || w.pageYOffset;
  	        method = original.scroll;
  	      } else {
  	        scrollable = el;
  	        startX = el.scrollLeft;
  	        startY = el.scrollTop;
  	        method = scrollElement;
  	      }

  	      // scroll looping over a frame
  	      step({
  	        scrollable: scrollable,
  	        method: method,
  	        startTime: startTime,
  	        startX: startX,
  	        startY: startY,
  	        x: x,
  	        y: y
  	      });
  	    }

  	    // ORIGINAL METHODS OVERRIDES
  	    // w.scroll and w.scrollTo
  	    w.scroll = w.scrollTo = function() {
  	      // avoid action when no arguments are passed
  	      if (arguments[0] === undefined) {
  	        return;
  	      }

  	      // avoid smooth behavior if not required
  	      if (shouldBailOut(arguments[0]) === true) {
  	        original.scroll.call(
  	          w,
  	          arguments[0].left !== undefined
  	            ? arguments[0].left
  	            : typeof arguments[0] !== 'object'
  	              ? arguments[0]
  	              : w.scrollX || w.pageXOffset,
  	          // use top prop, second argument if present or fallback to scrollY
  	          arguments[0].top !== undefined
  	            ? arguments[0].top
  	            : arguments[1] !== undefined
  	              ? arguments[1]
  	              : w.scrollY || w.pageYOffset
  	        );

  	        return;
  	      }

  	      // LET THE SMOOTHNESS BEGIN!
  	      smoothScroll.call(
  	        w,
  	        d.body,
  	        arguments[0].left !== undefined
  	          ? ~~arguments[0].left
  	          : w.scrollX || w.pageXOffset,
  	        arguments[0].top !== undefined
  	          ? ~~arguments[0].top
  	          : w.scrollY || w.pageYOffset
  	      );
  	    };

  	    // w.scrollBy
  	    w.scrollBy = function() {
  	      // avoid action when no arguments are passed
  	      if (arguments[0] === undefined) {
  	        return;
  	      }

  	      // avoid smooth behavior if not required
  	      if (shouldBailOut(arguments[0])) {
  	        original.scrollBy.call(
  	          w,
  	          arguments[0].left !== undefined
  	            ? arguments[0].left
  	            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
  	          arguments[0].top !== undefined
  	            ? arguments[0].top
  	            : arguments[1] !== undefined ? arguments[1] : 0
  	        );

  	        return;
  	      }

  	      // LET THE SMOOTHNESS BEGIN!
  	      smoothScroll.call(
  	        w,
  	        d.body,
  	        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
  	        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
  	      );
  	    };

  	    // Element.prototype.scroll and Element.prototype.scrollTo
  	    Element.prototype.scroll = Element.prototype.scrollTo = function() {
  	      // avoid action when no arguments are passed
  	      if (arguments[0] === undefined) {
  	        return;
  	      }

  	      // avoid smooth behavior if not required
  	      if (shouldBailOut(arguments[0]) === true) {
  	        // if one number is passed, throw error to match Firefox implementation
  	        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
  	          throw new SyntaxError('Value could not be converted');
  	        }

  	        original.elementScroll.call(
  	          this,
  	          // use left prop, first number argument or fallback to scrollLeft
  	          arguments[0].left !== undefined
  	            ? ~~arguments[0].left
  	            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
  	          // use top prop, second argument or fallback to scrollTop
  	          arguments[0].top !== undefined
  	            ? ~~arguments[0].top
  	            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
  	        );

  	        return;
  	      }

  	      var left = arguments[0].left;
  	      var top = arguments[0].top;

  	      // LET THE SMOOTHNESS BEGIN!
  	      smoothScroll.call(
  	        this,
  	        this,
  	        typeof left === 'undefined' ? this.scrollLeft : ~~left,
  	        typeof top === 'undefined' ? this.scrollTop : ~~top
  	      );
  	    };

  	    // Element.prototype.scrollBy
  	    Element.prototype.scrollBy = function() {
  	      // avoid action when no arguments are passed
  	      if (arguments[0] === undefined) {
  	        return;
  	      }

  	      // avoid smooth behavior if not required
  	      if (shouldBailOut(arguments[0]) === true) {
  	        original.elementScroll.call(
  	          this,
  	          arguments[0].left !== undefined
  	            ? ~~arguments[0].left + this.scrollLeft
  	            : ~~arguments[0] + this.scrollLeft,
  	          arguments[0].top !== undefined
  	            ? ~~arguments[0].top + this.scrollTop
  	            : ~~arguments[1] + this.scrollTop
  	        );

  	        return;
  	      }

  	      this.scroll({
  	        left: ~~arguments[0].left + this.scrollLeft,
  	        top: ~~arguments[0].top + this.scrollTop,
  	        behavior: arguments[0].behavior
  	      });
  	    };

  	    // Element.prototype.scrollIntoView
  	    Element.prototype.scrollIntoView = function() {
  	      // avoid smooth behavior if not required
  	      if (shouldBailOut(arguments[0]) === true) {
  	        original.scrollIntoView.call(
  	          this,
  	          arguments[0] === undefined ? true : arguments[0]
  	        );

  	        return;
  	      }

  	      // LET THE SMOOTHNESS BEGIN!
  	      var scrollableParent = findScrollableParent(this);
  	      var parentRects = scrollableParent.getBoundingClientRect();
  	      var clientRects = this.getBoundingClientRect();

  	      if (scrollableParent !== d.body) {
  	        // reveal element inside parent
  	        smoothScroll.call(
  	          this,
  	          scrollableParent,
  	          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
  	          scrollableParent.scrollTop + clientRects.top - parentRects.top
  	        );

  	        // reveal parent in viewport unless is fixed
  	        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
  	          w.scrollBy({
  	            left: parentRects.left,
  	            top: parentRects.top,
  	            behavior: 'smooth'
  	          });
  	        }
  	      } else {
  	        // reveal element in viewport
  	        w.scrollBy({
  	          left: clientRects.left,
  	          top: clientRects.top,
  	          behavior: 'smooth'
  	        });
  	      }
  	    };
  	  }

  	  {
  	    // commonjs
  	    module.exports = { polyfill: polyfill };
  	  }

  	}()); 
  } (smoothscroll$1));

  var smoothscrollExports = smoothscroll$1.exports;
  var smoothscroll = /*@__PURE__*/getDefaultExportFromCjs(smoothscrollExports);

  const fraap = new _default$1({
    modules: modules,
  });

  init();

  function init() {
    smoothscroll.polyfill();
    fraap.init(fraap);
  }

})();
