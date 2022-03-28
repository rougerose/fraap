// Pour mémoire, les premières lignes de codes pour le menu fraap.



function FraapMenu(element) {
  this.$el = element;
  // this.openLevel2 = this.openLevel2.bind(this);
  // this.openFromShortcut = this.openFromShortcut.bind(this);
  this.create();
}

FraapMenu.prototype.create = function () {
  this.$el.setAttribute("aria-hidden", true);
  this.$el.setAttribute("tab-index", -1);
};

FraapMenu.prototype.openFromShortcut = function (event) {
  console.log(this, event);
};

const menu = document.querySelector(".site-nav");
const menuFraap = new FraapMenu(menu);

// Menu burger
const burger = document.querySelector(".site-header_burger");
if (burger) {
  burger.addEventListener("click", () => {
    let expand = burger.getAttribute("aria-expanded") === true || false;
    burger.setAttribute("aria-expanded", !expand);
  });
}

// Menu raccourcis : lien -> bouton
const menuRaccourcis = document.getElementById("menu-shortcuts");
if (menuRaccourcis) {
  menuRaccourcis
    .querySelectorAll('li[data-type-link="dropdown"]')
    .forEach((raccourci) => {
      let bouton = convertLinkToButton(raccourci);
      bouton.addEventListener("click", (event) => {
        menuFraap.openFromShortcut(event);
      });
    });
}

function convertLinkToButton(parentLien) {
  const lien = parentLien.getElementsByTagName("a")[0],
    lienHTML = lien.innerHTML,
    lienAttributs = lien.attributes,
    bouton = document.createElement("button");

  bouton.innerHTML = lienHTML.trim();

  for (let i = 0; i < lienAttributs.length; i++) {
    let attribut = lienAttributs[i];

    if (attribut.name !== "href") {
      bouton.setAttribute(attribut.name, attribut.value);
    }
  }

  parentLien.replaceChild(bouton, lien);
  return bouton;
}
