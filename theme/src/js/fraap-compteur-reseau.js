import shuffle from "./util/shuffle";
import iterate from "./util/iterate";
import { compteur_reset, compteur_animer } from "./util/compteur";

const fraapCompteurReseau_init = () => {
  let reseau = document.querySelector("[data-network]");

  if (reseau && !!window.IntersectionObserver) {
    let compteur = reseau.querySelector("[data-network-counter]"),
      contenu = reseau.querySelector(".teaser-network_content"),
      carte = reseau.querySelector("[data-network-map]"),
      data = {
        debut: 0,
        fin: parseInt(reseau.getAttribute("data-network-total"), 10) || 0,
        texte: "0",
        html: compteur.querySelector("[data-network-counter-text]"),
        duree: parseInt(reseau.getAttribute("data-network-duree"), 10) || 1000,
        delai: parseInt(reseau.getAttribute("data-network-delai"), 10) || 0,
      };

    reseau.setAttribute("data-network-animation", "wait");

    compteur_reset(compteur, data);

    let observer = new IntersectionObserver(
      (entry, observer) => {
        let element = entry[0];
        if (element.isIntersecting) {
          element.target.setAttribute("data-network-animation", "true");
          compteur_animer(compteur, data);
          carte_animer(carte, data);
          observer.unobserve(element.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(reseau);
  }
};

/**
 * Sélectionner dans la carte un nombre de points identique
 * au total des associations et leur attribuer la couleur du thème
 * via une classe.
 */
 const carte_animer = (element, data) => {
  let pointsNode = element
      .querySelector("#mapGroup2")
      .querySelectorAll("circle"),
    total = data.fin,
    pointsListe = [].slice.call(pointsNode),
    points = [],
    intervalTime = Math.ceil(data.duree / (data.fin - data.debut)),
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

const fraapCompteurReseau = {
  init: fraapCompteurReseau_init,
};

fraapCompteurReseau.init();
