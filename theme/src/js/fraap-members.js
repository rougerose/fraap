import $ from "jQuery";

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
      $("#" + self.map._container.id).off("ready", onready);
    };

  // Activer le plugin leaflet d'activation de la carte
  self.sleep = L.control.toggleSleepMap({}).addTo(this.map);

  // Attendre l'événement "ready" pour ajouter
  // un gestionnaire de clic sur les points et désactiver la carte
  $("#" + self.map._container.id).on("ready", onready);

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
  this._scrollUI();
  this.map.flyTo(coord, 15);
  this.openMemberPopup(id);
  this._toggleMember(id);
};

FraapMembers.prototype.onclickMarker = function () {
  let self = this;
  this.map.eachLayer(function (layer) {
    layer.on("click", function (event) {
      if (this.feature) {
        self._scrollUI();
        self._toggleMember(this.feature.id);
      }
    });
    // Ajouter le clic dans les clusters
    if (
      self.map.options.cluster &&
      typeof layer.getChildCount !== "undefined"
    ) {
      $.each(layer.getAllChildMarkers(), function (index, marker) {
        marker.on("click", function () {
          if (this.feature) {
            self._scrollUI();
            self._toggleMember(this.feature.id);
          }
        });
      });
    }
  });
};

/**
 * Remettre au centre de la fenêtre la carte et la liste des membres.
 */
FraapMembers.prototype._scrollUI = function () {
  if (this.bar.offsetTop == 0) {
    this.bar.scrollIntoView({ behavior: "smooth" });
  } else if (this.bar.offsetTop > 0) {
    window.scrollTo({
      top: this.container.offsetParent.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  }
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
    i,
    count = 0;

  for (i in map._layers) {
    if (
      (map._layers[i].feature && map._layers[i].feature.id == id) ||
      (map._layers[i].id && ma._layers[i].id == id)
    ) {
      map.centerAndZoom(map._layers[i].getLatLng(), false);
      map._layers[i].openPopup();
      break;
    }
    count++;
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

export default FraapMembers;
