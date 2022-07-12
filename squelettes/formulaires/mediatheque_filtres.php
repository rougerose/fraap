<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_mediatheque_filtres_charger($id_groupe = 0, $self = null) {
	$valeurs = [];
	$valeurs['id_groupe'] = $id_groupe;
	$valeurs['mots'] = _request('mots');
	return $valeurs;
}

function formulaires_mediatheque_filtres_verifer($id_groupe = 0, $self = null) {
	return [];
}

function formulaires_mediatheque_filtres_traiter($id_groupe = 0, $self = null) {
	$retour = [];
	$redirect = parametre_url($self, 'mots', '');
	$redirect = parametre_url($redirect, 'mots', array_unique(_request('mots')));
	$retour['redirect'] = $redirect;
	return $retour;
}
