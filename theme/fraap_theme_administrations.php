<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

include_spip('inc/meta');
include_spip('inc/fraap_theme');

/**
 * Lors de l'installation, enregistrer une nuance chromatique des pages publiques
 */
function fraap_theme_upgrade($nom_meta_base_version, $version_cible) {
	$current_version = 0.0;
	if (
		(!isset($GLOBALS['meta'][$nom_meta_base_version]))
			|| (($current_version = $GLOBALS['meta'][$nom_meta_base_version]) != $version_cible)
	) {
		ecrire_meta($nom_meta_base_version, $current_version = '1.0.0', 'non');
		$nuance = strval(fraap_theme_renouveler_nuance());
		ecrire_meta('fraap_theme_nuance', $nuance);
	}
}

function fraap_theme_vider_tables($nom_meta_base_version) {
	effacer_meta($nom_meta_base_version);
	effacer_meta('fraap_theme_nuance');
}
