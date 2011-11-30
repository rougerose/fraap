<?php

if (!defined('_ECRIRE_INC_VERSION')) return;

include_spip('inc/actions');
include_spip('inc/editer');

function formulaires_candidature_charger_dist($id_stage='new', $id_auteur='', $retour=''){
	$valeurs = '';
	return $valeurs;
}
function formulaires_candidature_verifier_dist($id_stage='new', $id_auteur='', $retour=''){
//	$erreurs = formulaires_editer_objet_verifier('chat', $id_chat, array('nom'));
	return $erreurs;
}
function formulaires_candidature_traiter_dist($id_stage='new', $id_auteur='', $retour=''){
//	return formulaires_editer_objet_traiter('chat', $id_chat, '', '', $retour, '');
}

?>