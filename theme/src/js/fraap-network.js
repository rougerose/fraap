import shuffle from "./util/shuffle";
import iterate from "./util/iterate";

/**
 * Mettre à zéro le compteur des associations
 */
const resetCompteur = (element, attr) => {
  let compteurTexte = element.querySelector("[data-network-counter-text]"),
    compteur = attr.debut.toLocaleString("fr", {minimumIntegerDigits: 3});

  compteurTexte.innerHTML = attr.format.replace("{}", compteur);
}


/**
 * Animation et incrémentation du compteur des associations
 */
const animerCompteur = (element, attr) => {
  let compteurTexte = element.querySelector("[data-network-counter-text]"),
    compteur = attr.debut;

  compteurTexte.innerHTML = attr.format.replace("{}", compteur);
  let intervalTime = Math.ceil(attr.duree / (attr.fin - attr.debut));

  setTimeout(() => {
    let interval = setInterval(intervalHandler, intervalTime);
    function intervalHandler() {
      compteur +=
        ((attr.fin - attr.debut) / Math.abs(attr.fin - attr.debut)) * 1;
      compteurTexte.innerHTML = attr.format.replace(
        "{}",
        compteur.toLocaleString("fr", { minimumIntegerDigits: 3 })
      );
      if (compteur == attr.fin) {
        clearInterval(interval);
      }
    }
  }, attr.delai);
};


/**
 * Sélectionner dans la carte un nombre de points identique
 * au total des associations et leur attribuer la couleur du thème
 * via une classe.
 */
const animerCarte = (element, attr) => {
  let pointsNode = element
      .querySelector("#mapGroup2")
      .querySelectorAll("circle"),
    total = attr.fin,
    pointsListe = [].slice.call(pointsNode),
    points = [],
    intervalTime = Math.ceil(attr.duree / (attr.fin - attr.debut)),
    animer;

  pointsListe = shuffle(pointsListe);
  points = pointsListe.slice(0, total);
  animer = iterate(
    points,
    function (obj) {
      obj.classList.add("teaser-network_map-dot");
    },
    intervalTime
  );
};

/**
 * Activer le script
 *
 * Si l'API IntersectionObserver est disponible,
 * différentes animations sont appliquées :
 *    - opacité et légère translation d'apparition du bloc entier
 *    - animation du compteur
 *    - animation de la carte
 */
const fraapNetworkInit = () => {
  let network = document.querySelector("[data-network]");

  if (network && !!window.IntersectionObserver) {
    let compteur = network.querySelector("[data-network-counter]"),
      contenu = network.querySelector(".teaser-network_content"),
      carte = network.querySelector("[data-network-map]"),
      data = {
        debut: 0,
        fin: parseInt(network.getAttribute("data-network-total"), 10) || 0,
        format: "{}",
        duree: parseInt(network.getAttribute("data-network-duree"), 10) || 1000,
        delai: parseInt(network.getAttribute("data-network-delai"), 10) || 0,
      };

    network.setAttribute("data-network-animation", "wait");
    resetCompteur(compteur, data);

    let observer = new IntersectionObserver(
      (entry, observer) => {
        let el = entry[0];
        if (el.isIntersecting) {
          el.target.setAttribute("data-network-animation", "true");
          animerCompteur(compteur, data);
          animerCarte(carte, data);
          observer.unobserve(el.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(network);
  }
}

const fraapNetwork = {
  init: fraapNetworkInit
}

fraapNetwork.init();
