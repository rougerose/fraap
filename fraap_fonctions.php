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

?>
