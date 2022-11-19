<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}


/**
 * Ajouter aux intertitres un span.text-underline
 *
 * Les racourcis spip d'intertitres et leurs niveaux éventuels
 * sont conservés pour être traités par porte_plume_intertitres
 *
 */
function fraap_squelettes_intertitres($t) {
	// $t[1] => {{{
	// $t[2] => *
	// $t[3] => titre
	// $t[4] => }}}
	$mix = $t[1] . $t[2] . '<span class="text-underline">' . $t[3] . '</span>' . $t[4];
	return $mix;
}
