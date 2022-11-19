/**
 * Plugin Leaflet pour gérer un état désactivé/activé de la carte
 * et permettre un scroll dans la page.
 *
 * Le plugin créé directement le bouton d'activation de la carte,
 * et un calque en "overlay". Ces deux éléments sont placés
 * en dehors des zones de contrôles standards de la carte pour
 * une gestion plus simple des CSS.
 *
 * Le bouton de désactivation est placé, quant à lui, dans un conteneur
 * standard de contrôle, sa création est donc déléguée au second plugin
 * DisableSleepMap (voir ci-dessous). L'instance de ce bouton est récupérée
 * par le premier plugin qui gère les événements sur chaque bouton.
 *
 */

L.Control.ToggleSleepMap = L.Control.extend({
  options: {
    onloadDisable: false,
    mapHandlers: {},
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    let container = this._container,
      className = "leaflet-toggleSleepMap";
    if (!container) {
      container = L.DomUtil.create("div", className);
    }

    // Overlay
    this._overlay = L.DomUtil.create("div", className + "_overlay", container);

    // Enable button
    let enable = L.DomUtil.create(
      "button",
      className + "_btn variant-enable button-cta variant-button button-ripple",
      container
    );
    enable.type = "button";
    enable.innerHTML = "Activer la carte";
    this._enableBtn = enable;

    // Disable button via le second plugin
    let disable = L.control.disableSleepMap();
    this._map.addControl(disable);
    this._disableBtn = disable._disableBtn;
    this._disableBtn.setAttribute("aria-hidden", "true");

    // Map disabled state
    if (this.options.onloadDisable) {
      this.disableMap();
    }

    // Add events
    L.DomEvent.on(this._enableBtn, "click", this.enableMap, this);
    L.DomEvent.on(this._disableBtn, "click", this.disableMap, this);

    return container;
  },

  addTo: function (map) {
    this.onRemove();
    this._map = map;
    this._container = this.onAdd(map);

    this._container.setAttribute("aria-hidden", "true");

    L.DomUtil.addClass(this._container, "leaflet-control-container");
    if (L.Browser.touch) {
      L.DomUtil.addClass(this._container, "leaflet-touch");
    }
    // insert as first child of map container (important for css)
    map._container.insertBefore(this._container, map._container.firstChild);
    return this;
  },

  onRemove: function (map) {
    return this;
  },

  disableMap: function () {
    this._disableMapHandlers();
    this._container.setAttribute("aria-hidden", "false");
    this._disableBtn.setAttribute("aria-hidden", "true");
  },

  enableMap: function () {
    this._enableMapHandlers();
    this._container.setAttribute("aria-hidden", "true");
    this._disableBtn.setAttribute("aria-hidden", "false");
  },

  // Désactiver la carte : une boucle sur tous les gestionnaires
  // aurait été plus simple, mais elle ne semble pas disponible
  // et simple à faire.
  _disableMapHandlers: function () {
    let map = this._map,
      handlers = this.options.mapHandlers;

    if (Object.keys(handlers).length === 0) {
      handlers = this.options.mapHandlers = this._getMapHandlers();
    }

    if (handlers.dragging) {
      map.dragging.disable();
    }
    if (handlers.touchZoom) {
      map.touchZoom.disable();
    }
    if (handlers.doubleClickZoom) {
      map.doubleClickZoom.disable();
    }
    if (handlers.scrollWheelZoom) {
      map.scrollWheelZoom.disable();
    }
    if (handlers.boxZoom) {
      map.boxZoom.disable();
    }
    if (handlers.keyboard) {
      map.keyboard.disable();
    }
    if (handlers.tap) {
      map.tap.disable();
    }
  },

  // Activer la carte (et même commentaire que pour la désactivation)
  _enableMapHandlers: function () {
    let map = this._map,
      handlers = this.options.mapHandlers;

    if (Object.keys(handlers).length === 0) {
      handlers = this.options.mapHandlers = this._getMapHandlers();
    }
    if (handlers.dragging) {
      map.dragging.enable();
    }
    if (handlers.touchZoom) {
      map.touchZoom.enable();
    }
    if (handlers.doubleClickZoom) {
      map.doubleClickZoom.enable();
    }
    if (handlers.scrollWheelZoom) {
      map.scrollWheelZoom.enable();
    }
    if (handlers.boxZoom) {
      map.boxZoom.enable();
    }
    if (handlers.keyboard) {
      map.keyboard.enable();
    }
    if (handlers.tap) {
      map.tap.enable();
    }
  },

  // Enregistrer l'état par défaut des gestionnaires de la carte.
  _getMapHandlers: function () {
    let map = this._map;
    let handlers = {
      dragging: map.dragging._enabled || false,
      touchZoom: map.touchZoom._enabled || false,
      doubleClickZoom: map.doubleClickZoom._enabled || false,
      scrollWheelZoom: map.scrollWheelZoom._enabled || false,
      boxZoom: map.boxZoom._enabled || false,
      keyboard: map.keyboard._enabled || false,
      tap: map.tap || false,
    };
    return handlers;
  },
});

L.control.toggleSleepMap = function (options) {
  return new L.Control.ToggleSleepMap(options);
};



L.Control.DisableSleepMap = L.Control.extend({
  options: {
    position: "topright",
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    let container = this._container;

    if (!container) {
      container = L.DomUtil.create("div");
    }

    let disableBtn = L.DomUtil.create(
      "button",
      "leaflet-toggleSleepMap_btn variant-disable button-cta variant-button button-ripple",
      container
    );
    disableBtn.type = "button";
    disableBtn.innerHTML = "Désactiver la carte";
    this._disableBtn = disableBtn;

    return container;
  },

  onRemove: function (map) {},
});

L.control.disableSleepMap = function (options) {
  return new L.Control.DisableSleepMap(options);
};
