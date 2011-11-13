<?php
if (!defined('_ECRIRE_INC_VERSION')) return;

function formulaires_tri_stages_charger_dist(){
	return array(
		'date_debut' => '',
		'date_fin' => '',
		'regions' => '',
		'ville' => '',
		'competences' => '',
		'recherches' => ''
	);
}

function formulaires_tri_stages_verifier_dist(){
	$erreurs = array();
/*	if ($date_debut = !_request('date_debut'))
		$erreurs['message_erreur'] = 'Aucune saisie';
*/	return $erreurs;
}

function formulaires_tri_stages_traiter_dist (){
	// $date_jour   = _request('date_jour');
	$retour = array('editable' => true);
    return $retour;
}

?>