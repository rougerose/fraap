<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

include_spip('inc/config');

/**
 * Renouveler toutes les 24 heures la nuance chromatique des pages publiques.
 * Le choix de la couleur est déterminée de manière aléatoire.
 */
function genie_fraap_theme_renouveler_nuancier_dist($t) {
	$fraap_theme_config = lire_config('fraap_theme', []);
	$nuanciers = [1, 2, 3, 4, 5, 6];
	$nuance = array_rand($nuanciers, 1);
	$fraap_theme_config = array_merge($fraap_theme_config, ['nuancier' => $nuanciers[$nuance]]);
	ecrire_config('fraap_theme', $fraap_theme_config);
	return 1;
}
