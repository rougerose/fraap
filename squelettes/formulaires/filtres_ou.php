<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_filtres_ou_charger($redirect = null) {
	$valeurs = [];
	$valeurs['mots_ou_24'] = _request('mots_ou_24');
	$valeurs['mots_ou_25'] = _request('mots_ou_25');
	return $valeurs;
}

function formulaires_filtres_ou_verifier($redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_filtres_ou_traiter($redirect = null) {
	$retour = [];
	$mots_ou_24 = _request('mots_ou_24');
	$mots_ou_25 = _request('mots_ou_25');

	$redirect = parametre_url($redirect, 'mots_ou_24', '');
	$redirect = parametre_url($redirect, 'mots_ou_25', '');
	if ($mots_ou_24) {
		$mots_ou_24 = array_unique($mots_ou_24);
		$redirect = parametre_url($redirect, 'mots_ou_24', $mots_ou_24);
	}

	if ($mots_ou_25) {
		$mots_ou_25 = array_unique($mots_ou_25);
		$redirect = parametre_url($redirect, 'mots_ou_25', $mots_ou_25);
	}
	$retour['redirect'] = $redirect;
	return $retour;
}
