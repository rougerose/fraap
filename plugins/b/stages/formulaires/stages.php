<?php

include_spip('inc/actions');
include_spip('inc/editer');

function formulaires_stages_charger_dist($id_formulaires_reponse='new', $retour='') {
	$valeurs = formulaires_editer_objet_charger('stage', $id_formulaires_reponse, '', '', $retour, '');
	$valeurs['regions'] = unserialize($valeurs['regions']);
	$valeurs['competences'] = unserialize($valeurs['competences']);
	$valeurs['recherches'] = unserialize($valeurs['recherches']);
/*	$valeurs = array(
		'id_formulaires_reponse' => $id_formulaires_reponse,
		'date_fin' => '',
		'regions' => ''
	);
*/
	return $valeurs;
}

function formulaires_stages_verifier_dist($id_formulaires_reponse='new', $retour=''){
        $erreurs = formulaires_editer_objet_verifier('stage', $id_formulaires_reponse, array('date_debut','date_fin','regions','ville'));
        return $erreurs;
}

/*
	TODO à terminer
*/

function formulaires_stages_traiter_dist($id_formulaires_reponse='new', $retour=''){
        return formulaires_editer_objet_traiter('stage', $id_formulaires_reponse, '', '', $retour, '');
}


/*
function formulaires_stages_traiter_dist()

il faut faire set_request('competences', serialize(_request('competences')));

*/
?>