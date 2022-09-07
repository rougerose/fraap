(function () {
	'use strict';

	// Dialog init
	let dialogEl = document.querySelector("#dialogFiltres"),
	options = { allowTouchMove: () => true };

	if (dialogEl) {
	new Fraap.FraapDialog(dialogEl, options);
	}

})();
