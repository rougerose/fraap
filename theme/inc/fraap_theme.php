<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

/**
 * Renouveler la nuance des pages publiques
 */
function fraap_theme_renouveler_nuance() {
	$nuanciers = [1, 2, 3, 4, 5, 6];
	$nuance = array_rand($nuanciers, 1);
	return $nuanciers[$nuance];
}
