<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_mobilisations_filtres_charger($id_rubrique = null, $redirect = null, $options = []) {
	$valeurs = [
		'id_rubrique' => $id_rubrique,
		'options' => $options,
		'btnOpen' => _request('btnOpen'),
		'mots' => _request('mots'),
	];
	return $valeurs;
}

function formulaires_mobilisations_filtres_verifier($id_rubrique = null, $redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_mobilisations_filtres_traiter($id_rubrique = null, $redirect = null) {
	$retour = [];
	$mots = _request('mots');
	$voir_resultats = _request('voir_resultats');

	if ($voir_resultats) {
		$redirect = parametre_url($redirect, 'mots', '');
		if ($mots) {
			$mots = array_unique($mots);
			$redirect = parametre_url($redirect, 'mots', $mots);
		}
		$redirect = ancre_url($redirect, 'articles');
		$retour['redirect'] = $redirect;
		$retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("articles");</script>';
	}
	$retour['editable'] = true;
	return $retour;
}
