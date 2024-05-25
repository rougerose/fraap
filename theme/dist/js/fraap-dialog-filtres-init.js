(function () {
  'use strict';

  // Dialog init
  let dialogEl = document.querySelector("#dialogFiltres"),
  options = { allowTouchMove: () => true };

  if (dialogEl) {
    let dialogFiltres = new Fraap.FraapDialog(dialogEl, options);
    console.log(dialogFiltres);
  }

})();
