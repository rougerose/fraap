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

export { compteur_reset, compteur_animer };
