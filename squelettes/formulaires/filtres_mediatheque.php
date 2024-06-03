<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_filtres_mediatheque_charger($id_rubrique = '') {
	$valeurs = [
		'id_rubrique' => intval($id_rubrique),
		'recherche' => _request('recherche'),
		'type_ref' => _request('type_ref'),
		'btnOpen' => _request('btnOpen'),
		'mots' => _request('mots'),
	];

	// Paramètres à transmettre au squelette qui calculera le nombre
	// de référence disponibles.
	$args = [];

	if ($valeurs['recherche'] && strlen($valeurs['recherche'])) {
		$args['recherche'] = $valeurs['recherche'];
	}

	if ($valeurs['type_ref'] && strlen($valeurs['type_ref'])) {
		$args['type_ref'] = $valeurs['type_ref'];
	} else {
		$valeurs['type_ref'] = null;
	}

	if ($valeurs['mots']) {
		$args['mots'] = $valeurs['mots'];
	}

	$valeurs['resultats'] = unserialize(recuperer_fond('inclure/formulaires/fond-filtres-mediatheque', $args));

	return $valeurs;
}

function formulaires_filtres_mediatheque_verifier($id_rubrique = '') {
	$erreurs = [];
	return $erreurs;
}

function formulaires_filtres_mediatheque_traiter($id_rubrique = '') {
	$res = [];
	return $res;
}
