import FraapMembers from "./fraap-members";

window.callback_map_members = function (map) {
  const members = new FraapMembers(map, "#map_members");
};
