var Fraap = (function (exports) {
	'use strict';

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

	var focusableSelectors = [
	  'a[href]:not([tabindex^="-"])',
	  'area[href]:not([tabindex^="-"])',
	  'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
	  'input[type="radio"]:not([disabled]):not([tabindex^="-"])',
	  'select:not([disabled]):not([tabindex^="-"])',
	  'textarea:not([disabled]):not([tabindex^="-"])',
	  'button:not([disabled]):not([tabindex^="-"])',
	  'iframe:not([tabindex^="-"])',
	  'audio[controls]:not([tabindex^="-"])',
	  'video[controls]:not([tabindex^="-"])',
	  '[contenteditable]:not([tabindex^="-"])',
	  '[tabindex]:not([tabindex^="-"])',
	];

	var TAB_KEY = 'Tab';
	var ESCAPE_KEY = 'Escape';

	/**
	 * Define the constructor to instantiate a dialog
	 *
	 * @constructor
	 * @param {Element} element
	 */
	function A11yDialog(element) {
	  // Prebind the functions that will be bound in addEventListener and
	  // removeEventListener to avoid losing references
	  this._show = this.show.bind(this);
	  this._hide = this.hide.bind(this);
	  this._maintainFocus = this._maintainFocus.bind(this);
	  this._bindKeypress = this._bindKeypress.bind(this);

	  this.$el = element;
	  this.shown = false;
	  this._id = this.$el.getAttribute('data-a11y-dialog') || this.$el.id;
	  this._previouslyFocused = null;
	  this._listeners = {};

	  // Initialise everything needed for the dialog to work properly
	  this.create();
	}

	/**
	 * Set up everything necessary for the dialog to be functioning
	 *
	 * @param {(NodeList | Element | string)} targets
	 * @return {this}
	 */
	A11yDialog.prototype.create = function () {
	  this.$el.setAttribute('aria-hidden', true);
	  this.$el.setAttribute('aria-modal', true);
	  this.$el.setAttribute('tabindex', -1);

	  if (!this.$el.hasAttribute('role')) {
	    this.$el.setAttribute('role', 'dialog');
	  }

	  // Keep a collection of dialog openers, each of which will be bound a click
	  // event listener to open the dialog
	  this._openers = $$('[data-a11y-dialog-show="' + this._id + '"]');
	  this._openers.forEach(
	    function (opener) {
	      opener.addEventListener('click', this._show);
	    }.bind(this)
	  );

	  // Keep a collection of dialog closers, each of which will be bound a click
	  // event listener to close the dialog
	  const $el = this.$el;

	  this._closers = $$('[data-a11y-dialog-hide]', this.$el)
	    // This filter is necessary in case there are nested dialogs, so that
	    // only closers from the current dialog are retrieved and effective
	    .filter(function (closer) {
	      // Testing for `[aria-modal="true"]` is not enough since this attribute
	      // and the collect of closers is done at instantation time, when nested
	      // dialogs might not have yet been instantiated. Note that if the dialogs
	      // are manually instantiated, this could still fail because none of these
	      // selectors would match; this would cause closers to close all parent
	      // dialogs instead of just the current one
	      return closer.closest('[aria-modal="true"], [data-a11y-dialog]') === $el
	    })
	    .concat($$('[data-a11y-dialog-hide="' + this._id + '"]'));

	  this._closers.forEach(
	    function (closer) {
	      closer.addEventListener('click', this._hide);
	    }.bind(this)
	  );

	  // Execute all callbacks registered for the `create` event
	  this._fire('create');

	  return this
	};

	/**
	 * Show the dialog element, disable all the targets (siblings), trap the
	 * current focus within it, listen for some specific key presses and fire all
	 * registered callbacks for `show` event
	 *
	 * @param {CustomEvent} event
	 * @return {this}
	 */
	A11yDialog.prototype.show = function (event) {
	  // If the dialog is already open, abort
	  if (this.shown) {
	    return this
	  }

	  // Keep a reference to the currently focused element to be able to restore
	  // it later
	  this._previouslyFocused = document.activeElement;

	  // Due to a long lasting bug in Safari, clicking an interactive element (like
	  // a <button>) does *not* move the focus to that element, which means
	  // `document.activeElement` is whatever element is currently focused (like an
	  // <input>), or the <body> element otherwise. We can work around that problem
	  // by checking whether the focused element is the <body>, and if it, store the
	  // click event target.
	  // See: https://bugs.webkit.org/show_bug.cgi?id=22261
	  const target = event && event.target ? event.target : null;
	  if (target && Object.is(this._previouslyFocused, document.body)) {
	    this._previouslyFocused = target;
	  }

	  this.$el.removeAttribute('aria-hidden');
	  this.shown = true;

	  // Set the focus to the dialog element
	  moveFocusToDialog(this.$el);

	  // Bind a focus event listener to the body element to make sure the focus
	  // stays trapped inside the dialog while open, and start listening for some
	  // specific key presses (TAB and ESC)
	  document.body.addEventListener('focus', this._maintainFocus, true);
	  document.addEventListener('keydown', this._bindKeypress);

	  // Execute all callbacks registered for the `show` event
	  this._fire('show', event);

	  return this
	};

	/**
	 * Hide the dialog element, enable all the targets (siblings), restore the
	 * focus to the previously active element, stop listening for some specific
	 * key presses and fire all registered callbacks for `hide` event
	 *
	 * @param {CustomEvent} event
	 * @return {this}
	 */
	A11yDialog.prototype.hide = function (event) {
	  // If the dialog is already closed, abort
	  if (!this.shown) {
	    return this
	  }

	  this.shown = false;
	  this.$el.setAttribute('aria-hidden', 'true');

	  // If there was a focused element before the dialog was opened (and it has a
	  // `focus` method), restore the focus back to it
	  // See: https://github.com/KittyGiraudel/a11y-dialog/issues/108
	  if (this._previouslyFocused && this._previouslyFocused.focus) {
	    this._previouslyFocused.focus();
	  }

	  // Remove the focus event listener to the body element and stop listening
	  // for specific key presses
	  document.body.removeEventListener('focus', this._maintainFocus, true);
	  document.removeEventListener('keydown', this._bindKeypress);

	  // Execute all callbacks registered for the `hide` event
	  this._fire('hide', event);

	  return this
	};

	/**
	 * Destroy the current instance (after making sure the dialog has been hidden)
	 * and remove all associated listeners from dialog openers and closers
	 *
	 * @return {this}
	 */
	A11yDialog.prototype.destroy = function () {
	  // Hide the dialog to avoid destroying an open instance
	  this.hide();

	  // Remove the click event listener from all dialog openers
	  this._openers.forEach(
	    function (opener) {
	      opener.removeEventListener('click', this._show);
	    }.bind(this)
	  );

	  // Remove the click event listener from all dialog closers
	  this._closers.forEach(
	    function (closer) {
	      closer.removeEventListener('click', this._hide);
	    }.bind(this)
	  );

	  // Execute all callbacks registered for the `destroy` event
	  this._fire('destroy');

	  // Keep an object of listener types mapped to callback functions
	  this._listeners = {};

	  return this
	};

	/**
	 * Register a new callback for the given event type
	 *
	 * @param {string} type
	 * @param {Function} handler
	 */
	A11yDialog.prototype.on = function (type, handler) {
	  if (typeof this._listeners[type] === 'undefined') {
	    this._listeners[type] = [];
	  }

	  this._listeners[type].push(handler);

	  return this
	};

	/**
	 * Unregister an existing callback for the given event type
	 *
	 * @param {string} type
	 * @param {Function} handler
	 */
	A11yDialog.prototype.off = function (type, handler) {
	  var index = (this._listeners[type] || []).indexOf(handler);

	  if (index > -1) {
	    this._listeners[type].splice(index, 1);
	  }

	  return this
	};

	/**
	 * Iterate over all registered handlers for given type and call them all with
	 * the dialog element as first argument, event as second argument (if any). Also
	 * dispatch a custom event on the DOM element itself to make it possible to
	 * react to the lifecycle of auto-instantiated dialogs.
	 *
	 * @access private
	 * @param {string} type
	 * @param {CustomEvent} event
	 */
	A11yDialog.prototype._fire = function (type, event) {
	  var listeners = this._listeners[type] || [];
	  var domEvent = new CustomEvent(type, { detail: event });

	  this.$el.dispatchEvent(domEvent);

	  listeners.forEach(
	    function (listener) {
	      listener(this.$el, event);
	    }.bind(this)
	  );
	};

	/**
	 * Private event handler used when listening to some specific key presses
	 * (namely ESCAPE and TAB)
	 *
	 * @access private
	 * @param {Event} event
	 */
	A11yDialog.prototype._bindKeypress = function (event) {
	  // This is an escape hatch in case there are nested dialogs, so the keypresses
	  // are only reacted to for the most recent one
	  const focused = document.activeElement;
	  if (focused && focused.closest('[aria-modal="true"]') !== this.$el) return

	  // If the dialog is shown and the ESCAPE key is being pressed, prevent any
	  // further effects from the ESCAPE key and hide the dialog, unless its role
	  // is 'alertdialog', which should be modal
	  if (
	    this.shown &&
	    event.key === ESCAPE_KEY &&
	    this.$el.getAttribute('role') !== 'alertdialog'
	  ) {
	    event.preventDefault();
	    this.hide(event);
	  }

	  // If the dialog is shown and the TAB key is being pressed, make sure the
	  // focus stays trapped within the dialog element
	  if (this.shown && event.key === TAB_KEY) {
	    trapTabKey(this.$el, event);
	  }
	};

	/**
	 * Private event handler used when making sure the focus stays within the
	 * currently open dialog
	 *
	 * @access private
	 * @param {Event} event
	 */
	A11yDialog.prototype._maintainFocus = function (event) {
	  // If the dialog is shown and the focus is not within a dialog element (either
	  // this one or another one in case of nested dialogs) or within an element
	  // with the `data-a11y-dialog-focus-trap-ignore` attribute, move it back to
	  // its first focusable child.
	  // See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
	  if (
	    this.shown &&
	    !event.target.closest('[aria-modal="true"]') &&
	    !event.target.closest('[data-a11y-dialog-ignore-focus-trap]')
	  ) {
	    moveFocusToDialog(this.$el);
	  }
	};

	/**
	 * Convert a NodeList into an array
	 *
	 * @param {NodeList} collection
	 * @return {Array<Element>}
	 */
	function toArray(collection) {
	  return Array.prototype.slice.call(collection)
	}

	/**
	 * Query the DOM for nodes matching the given selector, scoped to context (or
	 * the whole document)
	 *
	 * @param {String} selector
	 * @param {Element} [context = document]
	 * @return {Array<Element>}
	 */
	function $$(selector, context) {
	  return toArray((context || document).querySelectorAll(selector))
	}

	/**
	 * Set the focus to the first element with `autofocus` with the element or the
	 * element itself
	 *
	 * @param {Element} node
	 */
	function moveFocusToDialog(node) {
	  var focused = node.querySelector('[autofocus]') || node;

	  focused.focus();
	}

	/**
	 * Get the focusable children of the given element
	 *
	 * @param {Element} node
	 * @return {Array<Element>}
	 */
	function getFocusableChildren(node) {
	  return $$(focusableSelectors.join(','), node).filter(function (child) {
	    return !!(
	      child.offsetWidth ||
	      child.offsetHeight ||
	      child.getClientRects().length
	    )
	  })
	}

	/**
	 * Trap the focus inside the given element
	 *
	 * @param {Element} node
	 * @param {Event} event
	 */
	function trapTabKey(node, event) {
	  var focusableChildren = getFocusableChildren(node);
	  var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

	  // If the SHIFT key is being pressed while tabbing (moving backwards) and
	  // the currently focused item is the first one, move the focus to the last
	  // focusable item from the dialog element
	  if (event.shiftKey && focusedItemIndex === 0) {
	    focusableChildren[focusableChildren.length - 1].focus();
	    event.preventDefault();
	    // If the SHIFT key is not being pressed (moving forwards) and the currently
	    // focused item is the last one, move the focus to the first focusable item
	    // from the dialog element
	  } else if (
	    !event.shiftKey &&
	    focusedItemIndex === focusableChildren.length - 1
	  ) {
	    focusableChildren[0].focus();
	    event.preventDefault();
	  }
	}

	function instantiateDialogs() {
	  $$('[data-a11y-dialog]').forEach(function (node) {
	    new A11yDialog(node);
	  });
	}

	if (typeof document !== 'undefined') {
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', instantiateDialogs);
	  } else {
	    if (window.requestAnimationFrame) {
	      window.requestAnimationFrame(instantiateDialogs);
	    } else {
	      window.setTimeout(instantiateDialogs, 16);
	    }
	  }
	}

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

	function mainMenuInit() {
	  let menuShortcuts = document.querySelector("#navShortcuts"),
	    menuOffcanvas = document.querySelector("#siteNavOffcanvas");
	    menuOffcanvas.querySelector('[role="document"]');
	    let menuShortcutsList, offcanvasShortcutsList;

	  if (menuShortcuts && menuOffcanvas) {
	    menuShortcutsList = menuShortcuts.querySelectorAll('li[data-type-link="shortcut"]');
	    offcanvasShortcutsList = menuOffcanvas.querySelectorAll('li[data-type-link="shortcut"] > [href][data-menu-controls]');

	    offcanvasShortcutsList.forEach((shortcut) => {
	      let submenuPath = subMenuFromTo(shortcut, menuOffcanvas);

	      shortcut.addEventListener("click", (event) => {
	        event.preventDefault();
	        displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
	      });
	    });

	    resetMenu(menuOffcanvas);

	    menuShortcutsList.forEach((shortcut) => {
	      let link = shortcut.getElementsByTagName("a")[0];
	      convertLinkToButton(shortcut, link);
	    });
	  }
	}

	function convertLinkToButton(element, link) {
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
	        button.setAttribute("data-a11y-dialog-show", "siteNavOffcanvas");
	      }
	    }
	    element.replaceChild(button, link);
	  }
	  // return button;
	}

	const fraapMenu = { init: mainMenuInit };

	smoothscroll.polyfill();

	let dialogs = [
	  ["dialogRecherche", {}],
	  ["siteNavOffcanvas", { allowTouchMove: () => true }],
	];

	dialogs.forEach((dialog) => {
	  let id = dialog[0],
	    options = dialog[1];

	  let dialogEl = document.querySelector("#" + id);
	  if (dialogEl) {
	    if (id == "siteNavOffcanvas") {
	      // Activer les raccourcis avant l'instance Dialog
	      fraapMenu.init();
	    }
	    new FraapDialog(dialogEl, options);
	  }
	});

	exports.FraapDialog = FraapDialog;

	return exports;

})({});
