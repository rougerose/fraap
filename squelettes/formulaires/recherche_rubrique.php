<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_recherche_rubrique_charger($redirection = '', $class = '') {
	$action = ($redirection ? $redirection : generer_url_public('recherche'));

	$valeurs = [
		'recherche' => _request('recherche'),
		'action' => $action,
		'class' => $class,
		'_id_champ' => $class ? substr(md5($action . $class), 0, 4) : 'recherche',
	];

	return $valeurs;
}

function formulaires_recherche_rubrique_verifier($redirection = '', $class = '') {
	$erreurs = [];
	return $erreurs;
}

function formulaires_recherche_rubrique_traiter($redirection = '', $class = '') {
	$res = [];

	if ($redirection && $recherche = _request('recherche')) {
		$res['redirect'] = parametre_url($redirection, 'recherche', $recherche);
	}
	return $res;
}
