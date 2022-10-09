import {compteur_reset, compteur_animer} from "./util/compteur";


const fraapCompteurRessources_init = () => {
  let compteurs = document.querySelectorAll("[data-compteur]");

  if (compteurs && !!window.IntersectionObserver) {
    compteurs.forEach((compteur) => {
      let data = {
        debut: 0,
        fin: parseInt(compteur.getAttribute("data-compteur-total"), 10) || 0,
        texte: "0",
        html: compteur.querySelector("[data-compteur-html]"),
        duree: parseInt(compteur.getAttribute('data-compteur-duree'), 10) || 1000,
        delai: parseInt(compteur.getAttribute("data-compteur-delai"), 10) || 0,
      };
      // Réduire la taille du cercle pour l'animation
      compteur.setAttribute("data-compteur-animation", "wait");
      // Mettre le compteur à zéro
      compteur_reset(compteur, data);

      let observer = new IntersectionObserver((entry, observer) => {
        let element = entry[0];
        if (element.isIntersecting) {
          // animer le cercle via les CSS
          element.target.setAttribute("data-compteur-animation", "true");
          compteur_animer(compteur, data);
          observer.unobserve(element.target);
        }
      }, { threshold: 0.7 });
      observer.observe(compteur);
    });
  }
};

const fraapCompteurRessources = {
  init: fraapCompteurRessources_init,
};

fraapCompteurRessources.init();
