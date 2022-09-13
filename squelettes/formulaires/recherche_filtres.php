<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_recherche_filtres_charger($recherche = '', $facets = [], $redirect = '') {
	$valeurs = [
		'recherche' => $recherche,
		'facets' => $facets,
		'btnOpen' => _request('btnOpen'),
		'annee' => _request('annee'),
		'tags' => _request('tags'),
		'origine' => _request('origine'),
	];
	return $valeurs;
}

function formulaires_recherche_filtres_verifier($recherche = '', $facets = [], $redirect = '') {
	$erreurs = [];
	return $erreurs;
}

function formulaires_recherche_filtres_traiter($recherche = '', $facets = [], $redirect = '') {
	$retour = [];
	$voir_resultats = _request('voir_resultats');
	$tags = _request('tags');
	$origine = _request('origine');
	$annee = _request('annee');

	if ($voir_resultats) {
		$redirect = parametre_url($redirect, 'tags|origine|annee', '');

		if ($tags) {
			$tags = array_unique($tags);
			$redirect = parametre_url($redirect, 'tags', $tags);
		}

		if ($origine) {
			$redirect = parametre_url($redirect, 'origine', $origine);
		}

		if ($annee) {
			$redirect = parametre_url($redirect, 'annee', $annee);
		}
		// if ($mots) {
		// 	$mots = array_unique($mots);
		// 	$redirect = parametre_url($redirect, 'mots', $mots);
		// }
		// $redirect = ancre_url($redirect, 'articles');
		$retour['redirect'] = $redirect;
		$retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("recherche");</script>';
	}
	$retour['editable'] = true;
	return $retour;
}
