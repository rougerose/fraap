jQuery(function ($) {
  // Dialog init
  let dialogEl = document.querySelector("#dialogMembers"),
    options = { allowTouchMove: () => true };

  if (dialogEl) {
    new Fraap.FraapDialog(dialogEl, options);
    // console.log(dialogMembers);
  }

  // Initialiser les accordéons
  let container_collapsible = document.querySelector(".directory-members_container-list");
  if (container_collapsible && container_collapsible.querySelector(".collapsible")) {
    fraapCollapsible.init(container_collapsible, false);
  }
  // Callback de la carte GIS
  callback_map_members = function(map) {
    new FraapMembers(map);
  };
});
