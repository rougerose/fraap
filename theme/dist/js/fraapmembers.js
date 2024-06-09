(function ($) {
  'use strict';

  function FraapMembers(map, id) {
    this.map = map;
    this.el = document.querySelector(id);
    this.directoryContainer = this.el.parentElement.parentElement;
    this.directoryList = this.directoryContainer.querySelector(
      ".directory-members_list",
    );
    this.boxFilters = this.directoryContainer.previousElementSibling;
    this.flyToMember.bind(this);
    this.create();
  }

  FraapMembers.prototype.create = function () {
    let self = this;

    // Activer le plugin leaflet d'activation de la carte
    self.sleep = L.control.toggleSleepMap({}).addTo(this.map);

    let onready = function () {
      self.onclickMarker();
      self.sleep.disableMap();
      $("#" + self.map._container.id).off("ready", onready);
    };
    // Attendre l'événement "ready" pour ajouter
    // un gestionnaire de clic sur les points et désactiver la carte
    $("#" + self.map._container.id).on("ready", onready);

    self.openers = this.directoryList.querySelectorAll(".card-member");
    for (const opener of self.openers) {
      opener
        .querySelector("button")
        .addEventListener("click", self.flyToMember.bind(self));
    }

    // self.openers.forEach((opener) => {
    //   opener
    //     .querySelector("button")
    //     .addEventListener("click", self.flyToMember.bind(self));
    // });
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
    if (this.boxFilters.offsetTop == 0) {
      this.boxFilters.scrollIntoView({ behavior: "smooth" });
    } else if (this.boxFilters.offsetTop > 0) {
      window.scrollTo({
        top: this.directoryContainer.offsetParent.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  FraapMembers.prototype._toggleMember = function (memberId) {
    let member = this.directoryContainer.querySelector("#member-" + memberId);

    this.openers.forEach((opener) => {
      if (opener.classList.contains("is-active")) {
        opener.classList.remove("is-active");
      }
    });
    // Afficher la carte du membre sélectionné
    member.classList.add("is-active");
    this.directoryList.scrollTo({
      top: member.offsetTop - 1,
      left: 0,
      behavior: "smooth",
    });
  };

  /**
   * Centrer sur le GIS d'un membre et ouvrir son popup.
   *
   * Fonction reprise de gis_focus_marker.
   *
   *
   * @param {Integer} id #ID_GIS du membre
   */
  FraapMembers.prototype.openMemberPopup = function (id) {
    let map = this.map,
      i,
      count = 0;
    for (i in map._layers) {
      if (
        L.MarkerClusterGroup &&
        map._layers[i] instanceof L.MarkerClusterGroup
      ) {
        map._layers[i].eachLayer(function (layer) {
          if (layer.id && layer.id == id) {
            map._layers[i].zoomToShowLayer(layer, function () {
              layer.openPopup();
            });
            count++;
          }
        });
        if (count > 0) {
          break;
        }
      } else if (
        (map._layers[i].feature && map._layers[i].feature.id == id) ||
        (map._layers[i].id && map._layers[i].id == id)
      ) {
        map.centerAndZoom(map._layers[i].getLatLng(), true);
        map._layers[i].openPopup();
        break;
      }
      count++;
    }
  };

  window.callback_map_members = function (map) {
    new FraapMembers(map, "#map_members");
  };

})($);
