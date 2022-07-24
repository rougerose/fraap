(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FraapMembers = factory());
})(this, (function () { 'use strict';

  function FraapMembers(map) {
    this.map = map;
    this.flyToMember.bind(this);

    this.create();

  }

  FraapMembers.prototype.create = function () {
    this.openers = $$('[data-fraapMember-id]');
    this.openers.forEach((opener) => {
      opener.addEventListener("click", this.flyToMember.bind(this));
    });

    return this;
  };

  FraapMembers.prototype.flyToMember = function (event) {
    let coord = [];
    coord.push(parseFloat(event.target.dataset.fraapmemberLat));
    coord.push(parseFloat(event.target.dataset.fraapmemberLon));
    console.log(coord, this.map);
    // this.map.openPopup(coord);
    // this.map.flyTo(coord, 15);
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

  return FraapMembers;

}));
