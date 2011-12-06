<?php
if (!defined("_ECRIRE_INC_VERSION")) return;
//include_spip('inc/actions');
include_spip('inc/editer');

function formulaires_editer_candidature_charger_dist($id_candidature='new', $id_auteur='',$retour=''){
	$valeurs = formulaires_editer_objet_charger('stage', $id_candidature, '', '', $retour, '');
	$valeurs['id_auteur'] = $id_auteur;
	$valeurs['regions'] = unserialize($valeurs['regions']);
	$valeurs['_hidden'] .= "<input type='hidden' name='id_auteur' value='".$valeurs['id_auteur']."' />";
	if ($id_candidature = intval($id_candidature)) {
		$valeurs['_hidden'] .= "<input type='hidden' name='id_candidature' value='".$valeurs['id_candidature']."' />";
	}
	return $valeurs;
}
function formulaires_editer_candidature_verifier_dist($id_candidature='new',$id_auteur='',$retour=''){
	$erreurs = formulaires_editer_objet_verifier('stage', $id_candidature, array('regions')); # completer la liste des champs obligatoires
	return $erreurs;
}
function formulaires_editer_candidature_traiter_dist($id_candidature='new',$id_auteur,$retour=''){
	$res = array();
	$action_editer = charger_fonction('editer_candidature','action');
	list($id,$err) = $action_editer();
	if ($err){
		$res['message_erreur'] = $err;
	}
	else {
		$res['message_ok'] = _L('ok');
		if ($retour) {
			$retour = parametre_url($retour,'id_candidature',$id_candidature);
			$res['redirect'] = $retour;
		}
	}
	$res['editable'] = true;
	return $res;


}
?>