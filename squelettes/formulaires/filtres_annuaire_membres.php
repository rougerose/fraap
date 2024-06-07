<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_filtres_annuaire_membres_charger($id_rubrique = '') {
	$valeurs = [
		'id_rubrique' => intval($id_rubrique),
		'recherche' => _request('recherche'),
		'btnOpen' => _request('btnOpen'),
		'mots' => _request('mots'),
	];

	// Paramètres à transmettre au squelette qui calculera le nombre
	// de référence disponibles.
	$args = [];

	if ($valeurs['recherche'] && strlen($valeurs['recherche'])) {
		$args['recherche'] = $valeurs['recherche'];
	}

	if ($valeurs['mots']) {
		$args['mots'] = $valeurs['mots'];
	}

	$valeurs['resultats'] = unserialize(recuperer_fond('inclure/formulaires/fond-filtres-annuaire_membres', $args));

	return $valeurs;
}

function formulaires_filtres_annuaire_membres_verifier($id_rubrique = '') {
	$erreurs = [];
	return $erreurs;
}

function formulaires_filtres_annaire_membres_traiter($id_rubrique = '') {
	$res = [];
	return $res;
}
