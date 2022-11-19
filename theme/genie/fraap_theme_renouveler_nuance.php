<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

include_spip('inc/config');
include_spip('inc/fraap_theme');

/**
 * Renouveler toutes les 24 heures la nuance chromatique des pages publiques.
 * Le choix de la couleur est déterminé de manière aléatoire.
 */
function genie_fraap_theme_renouveler_nuance_dist($t) {
	$nuance = strval(fraap_theme_renouveler_nuance());
	ecrire_config('fraap_theme_nuance', $nuance);
	return 1;
}
