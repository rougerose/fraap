<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function calculer_contexte_recherche_filtres($valeurs = []) {
	if (count($valeurs) > 0) {
		foreach ($valeurs as $cle => $valeur) {
			if ($valeur) {
				$contexte[$cle] = $valeur;
			} else {
				$contexte[$cle] = '';
			}
		}
		return $contexte;
	}
	return null;

}
