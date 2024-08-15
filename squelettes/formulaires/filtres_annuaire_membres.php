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
		'departements' => _request('departements'),
		'regions' => _request('regions'),
	];

	// Paramètres à transmettre au squelette qui calculera le nombre
	// de référence disponibles.
	$args = [];

	$args['id_rubrique'] = $valeurs['id_rubrique'];

	if ($valeurs['recherche'] && strlen($valeurs['recherche'])) {
		$args['recherche'] = $valeurs['recherche'];
	}

	foreach (['mots', 'departements', 'regions'] as $k) {
		if ($valeurs[$k]) {
			$args[$k] = $valeurs[$k];
		}
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
