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
	$filtrer = _request('filtrer');

	if ($mots) {
		$mots = array_unique($mots);
		$redirect = parametre_url($redirect, 'mots', '');
		$redirect = ancre_url(parametre_url($redirect, 'mots', $mots), 'liste');
	}

	if ($filtrer) {
		$retour['redirect'] = $redirect;
		// $retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("annuaire");</script>';
	}

	$retour['editable'] = true;

	return $retour;
}
