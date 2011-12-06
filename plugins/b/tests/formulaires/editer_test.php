<?php
if (!defined("_ECRIRE_INC_VERSION")) return;
include_spip('inc/actions');
include_spip('inc/editer');

function formulaires_editer_test_charger_dist($id_test='new', $id_auteur='',$retour=''){
	$valeurs = formulaires_editer_objet_charger('test', $id_test, '', '', $retour, '');
	$valeurs['id_auteur'] = $id_auteur;
	$valeurs['regions'] = unserialize($valeurs['regions']);
	$valeurs['_hidden'] .= "<input type='hidden' name='id_auteur' value='".$valeurs['id_auteur']."' />";
	if ($id_test = intval($id_test)) {
		$valeurs['_hidden'] .= "<input type='hidden' name='id_test' value='".$valeurs['id_test']."' />";
	}

	return $valeurs;
}
function formulaires_editer_test_verifier_dist($id_test='new',$id_auteur='',$retour=''){
	$erreurs = formulaires_editer_objet_verifier('test', $id_test, array('nom'));
	return $erreurs;
}
function formulaires_editer_test_traiter_dist($id_test='new',$id_auteur,$retour=''){
	$res = array();
	$action_editer = charger_fonction("editer_test",'action');
	list($id,$err) = $action_editer();
	if ($err){
		$res['message_erreur'] = $err;
	}
	else {
		$res['message_ok'] = _L('ok');
		if ($retour) {
			$retour = parametre_url($retour,'id_test',$id_test);
			$res['redirect'] = $retour;
		}
	}
	$res['editable'] = true;
	return $res;


}
?>