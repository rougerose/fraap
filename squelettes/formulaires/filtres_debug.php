<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_filtres_debug_charger($redirect) {
	$valeurs = [
		'id_rubrique' => 47,
		'type_ref' => _request('type_ref'),
		'mots' => _request('mots'),
	];

	$contexte = [];

	if ($valeurs['type_ref'] && strlen($valeurs['type_ref'])) {
		$contexte['type_ref'] = $valeurs['type_ref'];
	}

	if ($valeurs['mots']) {
		$contexte['mots'] = $valeurs['mots'];
	}


	$valeurs['resultats'] = unserialize(recuperer_fond('formulaires/inc-filtres-debug', $contexte));

	return $valeurs;
}

function formulaires_filtres_debug_verifier($redirect) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_filtres_debug_traiter($redirect) {
	$retour = [];
	$retour['redirect'] = $redirect;
	return $retour;
}
