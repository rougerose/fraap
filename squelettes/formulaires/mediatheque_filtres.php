<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_mediatheque_filtres_charger($recherche = '', $id_rubrique = '', $redirect = null) {
	$contexte = [];

	$valeurs = [
		'recherche' => $recherche,
		'id_rubrique' => $id_rubrique,
		'btnOpen' => _request('btnOpen'),
		'mots' => _request('mots'),
		'type_ref' => _request('type_ref'),
		'resultats' => '',
	];

	if (strlen($valeurs['recherche'])) {
		$contexte['recherche'] = $valeurs['recherche'];
	}

	if (is_array($valeurs['mots'])) {
		$contexte['mots'] = $valeurs['mots'];
	}

	if (strlen($valeurs['type_ref'])) {
		$contexte['type_ref'] = $valeurs['type_ref'];
	}

	if (count($contexte) > 0) {
		$valeurs['resultats'] = unserialize(recuperer_fond('inclure/formulaires/fond-filtres-mediatheque', $contexte));
	}

	return $valeurs;
}

function formulaires_mediatheques_filtres_verifier($recherche = '', $id_rubrique = '', $redirect = null) {
	$erreurs = [];
	return $erreurs;
}

function formulaires_mediatheque_filtres_traiter($recherche = '', $id_rubrique = '', $redirect = null) {
	$retour = [];
	$mots = _request('mots');
	$type_ref = _request('type_ref');
	$voir_resultats = _request('voir_resultats');

	if ($voir_resultats) {
		$redirect = parametre_url($redirect, 'mots|type_ref', '');

		if ($mots) {
			$mots = array_unique($mots);
			$redirect = parametre_url($redirect, 'mots', $mots);
		}

		if ($type_ref) {
			$redirect = parametre_url($redirect, 'type_ref', $type_ref);
		}

		// $redirect = ancre_url($redirect, 'articles');
		$retour['redirect'] = $redirect;
		$retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("mediatheque");</script>';
	}
	$retour['editable'] = true;
	return $retour;
}
