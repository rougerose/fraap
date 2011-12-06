<?php
function formulaires_test_charger_dist ($id_stage='new',$id_auteur=''){
    $valeurs = array(
		'id_stage' => $id_stage,
		'id_auteur' => $id_auteur,
		'regions'=>'',
		'ville_stage' => '',
		'date_debut' => '',
		'date_fin' => '',
		'ecole' => '',
		'ville_ecole' => '',
		'diplome' => '',
		'niveau' => '',
		'competences_offre' => '',
		'competences_recherche' =>''
    );
    return $valeurs;
}
function formulaires_test_verifier_dist (){
    $erreurs = array();

    return $erreurs;
}
function formulaires_test_traiter_dist (){
	$regions = _request('regions');
	$ville_stage = _request('ville_stage');
	$date_debut = _request('date_debut');
	$date_fin = _request('date_fin');
	$ecole = _request('ecole');
	$ville_ecole = _request('ville_ecole');
	$diplome = _request('diplome');
	$niveau = _request('niveau');
	$competences_offre = _request('competences_offre');
	$competences_recherche = _request('competences_recherche');
    $retour = array('editable' => true);
/*    if ($quantieme = calcule_quantieme($date_jour)) {
        $retour['message_ok'] = "Le quantième de $date_jour est $quantieme";
    } else {
        $retour['message_erreur'] = "Erreur lors du calcul du quantième !";
    }
*/    return $retour;
}

?>