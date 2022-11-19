<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_annuaire_membres_filtres_charger($id_rubrique = null, $redirect = null) {
	$valeurs = [];
	$valeurs['id_rubrique'] = $id_rubrique;
	$valeurs['btnOpen'] = _request('btnOpen');
	$valeurs['mots'] = _request('mots');
	return $valeurs;
}

function formulaires_annuaire_membres_filtres_verifier($id_rubrique = null, $redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_annuaire_membres_filtres_traiter($id_rubrique = null, $redirect = null) {
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
		$retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("articles");</script>';
	}

	$retour['editable'] = true;

	return $retour;
}
