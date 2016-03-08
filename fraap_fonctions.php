<?php

if (!defined('_ECRIRE_INC_VERSION')) return;

// restreindre l'affichage champs extra sur les articles de l'annuaire (rubrique 3)
// voir http://www.spip-contrib.net/Champs-Extras-2
//include_spip('inc/cextras_autoriser');
//restreindre_extras('article', array('site', 'contact'), 3);

// convertir une couleur hexadécimale en valeurs RGB
function couleur_hex2dec($couleur) {
  $red = hexdec(substr($couleur, 0, 2));
  $green = hexdec(substr($couleur, 2, 2));
  $blue = hexdec(substr($couleur, 4, 2));
  $couleur = $red.','.$green.','.$blue;
  return $couleur;
}

/**
 * comparaison d'une date par rapport à celle du jour
 * usage : [(#DATE|date_comparaison{365}|?{oui,non})]
 */

function date_comparaison($date,$jours) {
    $datetime1 = new DateTime($date);
    $datetime2 = new DateTime('now');
    $interval = $datetime1->diff($datetime2);
    $nbre = $interval->format('%a');
    if ($nbre >= $jours) {
        return true;
    } else {
        return false;
    }
}

/**
 * Surcharge filtre lien_ou_expose
 *
 * Génère des menus avec liens ou `<strong class='on'>` non clicable lorsque
 * l'item est sélectionné
 *
 * @filtre
 * @example
 *   ```
 *   [(#URL_RUBRIQUE|lien_expose{#TITRE, #ENV{test}|=={en_cours}})]
 *   ```
 *
 * @param string $url
 *   URL du lien
 * @param string $libelle
 *   Texte du lien
 * @param bool $on
 *   État exposé (génère un strong) ou non (génère un lien)
 * @param string $class
 *   Classes CSS ajoutées au lien
 * @param string $title
 *   Title ajouté au lien
 * @param string $rel
 *   Attribut `rel` ajouté au lien
 * @param string $evt
 *   Complement à la balise `a` pour gérer un événement javascript,
 *   de la forme ` onclick='...'`
 * @return string
 *   Code HTML
 */
function lien_expose($url, $libelle = null, $on = false, $class_on = "", $class_off = "", $title = "", $rel = "", $evt = '') {
	if ($on) {
		$bal = "strong";
		$att = ($class_on ? "class='". attribut_html($class_on) ."'" : "class='on'");
	} else {
		$bal = 'a';
		$att = "href='$url'"
			. ($title ? " title='" . attribut_html($title) . "'" : '')
			. ($class_off ? " class='" . attribut_html($class_off) . "'" : '')
			. ($rel ? " rel='" . attribut_html($rel) . "'" : '')
			. $evt;
	}
	if ($libelle === null) {
		$libelle = $url;
	}

	return "<$bal $att>$libelle</$bal>";
}


?>
