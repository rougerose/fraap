var FraapMembers = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  function FraapMembers(map) {
    this.map = map;
    this.container = map._container.parentElement.parentElement;
    this.list = this.container.querySelector("[role='list']");
    this.bar = this.container.previousElementSibling;
    this.flyToMember.bind(this);
    this.create();
  }

  FraapMembers.prototype.create = function () {
    let self = this,
      onready = function () {
        self.onclickMarker();
        self.sleep.disableMap();
        $__default["default"]("#" + self.map._container.id).off("ready", onready);
      };

    // Activer le plugin leaflet d'activation de la carte
    self.sleep = L.control.toggleSleepMap({}).addTo(this.map);

    // Attendre l'événement "ready" pour ajouter
    // un gestionnaire de clic sur les points et désactiver la carte
    $__default["default"]("#" + self.map._container.id).on("ready", onready);

    // smoothscroll.polyfill();

    self.openers = $$(".card-member", this.container);
    self.openers.forEach((opener) => {
      opener
        .querySelector("button")
        .addEventListener("click", self.flyToMember.bind(self));
    });
    return this;
  };

  FraapMembers.prototype.flyToMember = function (event) {
    let coord = [],
      id = event.target.dataset.fraapmemberId;

    coord.push(parseFloat(event.target.dataset.fraapmemberLat));
    coord.push(parseFloat(event.target.dataset.fraapmemberLon));
    this.map.flyTo(coord, 15);
    this.openMemberPopup(id);
    this._toggleMember(id);
  };

  FraapMembers.prototype.onclickMarker = function () {
    let self = this;
    this.map.eachLayer(function (layer) {
      layer.on("click", function (event) {
        if (this.feature) {
          // Position de la barre en haut de fenêtre
          if (self.bar.offsetTop == 0) {
            self.bar.scrollIntoView({ behavior: "smooth" });
          }

          // Si le bord haut du conteneur est trop, recentrer dans la fenêtre.
          if (self.bar.offsetTop > 0) {
            window.scrollTo({top: self.container.offsetParent.offsetTop, left: 0, behavior: "smooth"});
          }

          self._toggleMember(this.feature.id);
        }
      });
    });
  };

  FraapMembers.prototype._toggleMember = function (memberId) {
    let member = this.container.querySelector("#member-" + memberId);

    this.openers.forEach((opener) => {
      if (opener.classList.contains("is-active")) {
        opener.classList.remove("is-active");
      }
    });
    // Afficher la carte du membre sélectionné
    member.classList.add("is-active");
    this.list.scrollTo({
      top: member.offsetTop - 1,
      left: 0,
      behavior: "smooth",
    });
  };

  /**
   * Centrer sur le GIS d'un membre et ouvrir son popup.
   *
   * Fonction reprise partielle de gis_focus_marker.
   * Cette fonction ne prend pas en compte les éventuels clusters.
   *
   * @param {Integer} id #ID_GIS du membre
   */
  FraapMembers.prototype.openMemberPopup = function (id) {
    let map = this.map,
      i;

    for (i in map._layers) {
      if (
        (map._layers[i].feature && map._layers[i].feature.id == id) ||
        (map._layers[i].id && ma._layers[i].id == id)
      ) {
        map.centerAndZoom(map._layers[i].getLatLng(), false);
        map._layers[i].openPopup();
        break;
      }
    }
  };

  /**
   * Convert a NodeList into an array
   *
   * @param {NodeList} collection
   * @return {Array<Element>}
   */
  function toArray(collection) {
    return Array.prototype.slice.call(collection);
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
    return toArray((context || document).querySelectorAll(selector));
  }

  return FraapMembers;

})($);
