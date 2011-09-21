function go(choix) {
  var url = "mot" + choix.options[choix.selectedIndex].value + ".html";
  if (url) {
    location.href = url;
  }
}