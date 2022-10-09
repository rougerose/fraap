(function () {
  'use strict';

  /// Shuffle array
  /// @link https://stackoverflow.com/a/2450976

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  /// Iterate an array with delay
  /// @link https://stackoverflow.com/a/45484448

  const iterate = (array, fn, delay) => {
    let i = 0,
      // seed first call and store interval (to clear later)
      interval = setInterval(() => {
        // each loop, call passed in function
        fn(array[i]);
        // increment, and if we're past array, clear interval
        i++;
        if (i >= array.length - 1) {
          clearInterval(interval);
        }
      }, delay);
    return interval;
  };

  const compteur_reset = (element, data) => {
    let compteur = data.html,
      texte_debut = data.debut.toLocaleString("fr", { minimumIntegerDigits: 3 });

    if (compteur) {
      compteur.innerHTML = data.texte.replace(data.texte, texte_debut);
    }
  };

  const compteur_animer = (element, data) => {
    let compteur = data.html,
      total = data.debut,
      intervalTime = Math.ceil(data.duree / data.fin - data.debut);

    setTimeout(() => {

      function intervalHandler() {
        total += ((data.fin - data.debut) / Math.abs(data.fin - data.debut)) * 1;
        compteur.innerHTML = total.toLocaleString("fr", {
          minimumIntegerDigits: 3,
        });

        if (total == data.fin) {
          clearInterval(interval);
        }
      }

      let interval = setInterval(intervalHandler, intervalTime);

    }, data.delai);
  };

  const fraapCompteurReseau_init = () => {
    let reseau = document.querySelector("[data-network]");

    if (reseau && !!window.IntersectionObserver) {
      let compteur = reseau.querySelector("[data-network-counter]");
        reseau.querySelector(".teaser-network_content");
        let carte = reseau.querySelector("[data-network-map]"),
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
      carte_animer(carte, data);

      let observer = new IntersectionObserver(
        (entry, observer) => {
          let element = entry[0];
          if (element.isIntersecting) {
            element.target.setAttribute("data-network-animation", "true");
            compteur_animer(compteur, data);
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
      intervalTime = Math.ceil(data.duree / (data.fin - data.debut));

    pointsListe = shuffle(pointsListe);
    points = pointsListe.slice(0, total);
    iterate(
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

})();
