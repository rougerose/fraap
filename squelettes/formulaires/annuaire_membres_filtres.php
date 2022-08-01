<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_annuaire_membres_filtres_charger($articles = [], $redirect = null) {
	$valeurs = [];
	$valeurs['articles'] = $articles;
	$valeurs['btnOpen'] = _request('btnOpen');
	$valeurs['mots'] = _request('mots');
	return $valeurs;
}

function formulaires_annuaire_membres_filtres_verifier($articles = [], $redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_annuaire_membres_filtres_traiter($articles = [], $redirect = null) {
	// refuser_traiter_formulaire_ajax();
	$retour = [];
	$mots = _request('mots');
	$voir_resultats = _request('voir_resultats');

	if ($voir_resultats) {
		$redirect = parametre_url($redirect, 'mots', '');
		if ($mots) {
			$mots = array_unique($mots);
			$redirect = parametre_url($redirect, 'mots', $mots);
		}
		$redirect = ancre_url($redirect, 'annuaire');
		$retour['redirect'] = $redirect;
	}

	$retour['editable'] = true;

	return $retour;
}
