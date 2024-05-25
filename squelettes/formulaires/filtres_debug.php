<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_filtres_debug_charger($redirect = null) {
	$valeurs = [
		'id_rubrique' => _request('id_rubrique'),
		'type_ref' => _request('type_ref'),
		'mots' => _request('mots'),
	];

	$contexte = [];

	if ($valeurs['type_ref'] && strlen($valeurs['type_ref'])) {
		$contexte['type_ref'] = $valeurs['type_ref'];
	}

	if ($valeurs['mots'] && count($valeurs['mots']) > 0) {
		$contexte['mots'] = $valeurs['mots'];
	}


	$valeurs['resultats'] = unserialize(recuperer_fond('formulaires/inc-filtres-debug', $contexte));

	return $valeurs;
}

function formulaires_filtres_debug_verifier($redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_filtres_debug_traiter($redirect = null) {
	$retour = [];
	$retour['redirect'] = $redirect;
	return $retour;
}
