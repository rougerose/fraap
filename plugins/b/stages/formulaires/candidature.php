<?php

if (!defined('_ECRIRE_INC_VERSION')) return;


include_spip('base/abstract_sql');
include_spip('inc/editer');

function formulaires_candidature_charger_dist($id_candidature='new',$id_auteur=''){

	// est-ce qu'on vérifie ici s'il s'agit d'un dépôt et non d'une modification,
	// afin de ne pas effacer les valeurs ? A voir lors du test de modification d'un enregistrement
	// if $id_stage == new ?
	$valeurs = array(
		'id_candidature'		=> $id_candidature,
		'id_auteur'				=> $id_auteur,
		'regions' 				=> '',
		'ville_stage' 			=> '',
		'date_debut' 			=> '',
		'date_fin' 				=> '',
		'ecole' 				=> '',
		'ville_ecole' 			=> '',
		'diplome'				=> '',
		'niveau'				=> '',
		'competences_offre'		=> '',
		'competences_recherche' => ''
	);
	return $valeurs;

}

function formulaires_candidature_verifier_dist($id_candidature='new',$id_auteur=''){

	$erreurs = formulaires_editer_objet_verifier('stage',$id_candidature,
	//	array('regions','date_debut','date_fin','ecole','diplome','niveau','competences_offre','competences_recherche')
		array('regions')
	);

	// vérification des dates (via spip-bonux)
	include_spip('inc/date_gestion');
	$horaire = false;
	$date_debut = verifier_corriger_date_saisie('debut',$horaire,$erreurs);
	$date_fin = verifier_corriger_date_saisie('fin',$horaire,$erreurs);

	if ($date_debut AND $date_fin AND $date_fin<$date_debut)
	$erreurs['date_fin'] = _T('stages:erreur_date_avant_apres');

	return $erreurs;
}
function formulaires_candidature_traiter_dist($id_candidature='new',$id_auteur=''){
	$res = array();

	// si id_candidature n'est pas un nombre, c'est une creation
	if (!$id_candidature = intval($id_candidature)) {
		if (!$id_candidature = action_insert_candidature($id_auteur)) return array(false, _T('echec'));

		//$err = action_candidature_set($id_candidature);
	}
	foreach (array(
		'regions','ville_stage','date_debut','date_fin',
		'ecole','diplome','niveau','competences_offre','competences_recherche'
	) as $champ) {
		if (($a = _request($champ))!==null) {
			$res[$champ] = $a;
		}
	}
	$res['regions']=serialize($res['regions']);

	include_spip('inc/date_gestion');
	$horaire = false;
	$date_debut = verifier_corriger_date_saisie('debut',$horaire,$erreurs);
	$date_fin = verifier_corriger_date_saisie('fin',$horaire,$erreurs);

	$res['date_debut'] = date('Y-m-d',$date_debut);
	$res['date_fin'] = date('Y-m-d',$date_fin);

	include_spip('inc/modifier');
	modifier_contenu('stage',$id_candidature,'',$res);


//	if ($id_candidature) $err = action_revision_candidature($id_candidature);






/*	if ($err){
		$res['message_erreur'] = $err;
	}
	else {
		$res['message_ok'] = _L('ok');
		if ($retour) {
			$retour = parametre_url($retour,'id_evenement',$id);
			if (strpos($retour,'article')!==FALSE){
				$id_article = sql_getfetsel('id_article','spip_evenements','id_evenement='.intval($id));
				$retour = parametre_url($retour,'id_article',$id_article);
			}
			$res['redirect'] = $retour;
		}
	}
*/	$res['editable'] = true;
	return $res;

}

// creer une nouvelle candidature
function action_insert_candidature($id_auteur){

	// nouvelle candidature
	$id_candidature = sql_insertq("spip_stages", array(
		"id_auteur"=>intval($id_auteur), 'date' => date("Y-m-d H:i:s") "maj"=>date("Y-m-d H:i:s")
		)
	);

	if (!$id_candidature){
		spip_log("stage action formulaire : impossible d'ajouter une candidature",'stage');
		return false;
	}
	return $id_candidature;
}

function action_revision_candidature($id_candidature,$c=false) {
	if ($c===false) {
		$c = array();
		foreach (array(
			'regions','ville_stage','date_debut','date_fin',
			'ecole','diplome','niveau','competences_offre','competences_recherche'
		) as $champ) {
			if (($a = _request($champ))!==null) {
				$c[$champ] = $a;
			}
		}
		include_spip('inc/date_gestion');
		$horaire = false;
		$date_debut = verifier_corriger_date_saisie('debut',$horaire,$erreurs);
		$date_fin = verifier_corriger_date_saisie('fin',$horaire,$erreurs);

		$c['date_debut'] = date('Y-m-d',$date_debut);
		$c['date_fin'] = date('Y-m-d',$date_fin);

		include_spip('inc/modifier');
		modifier_contenu('stage',$id_candidature,'',$c);
	}
}


function action_candidature_set($id_auteur, $set=null){
	$err = '';

	if (is_null($set)){
		$c = array();
		foreach (array(
			'regions','ville_stage','date_debut','date_fin',
			'ecole','diplome','niveau','competences_offre','competences_recherche'
		) as $champ)
			$c[$champ] = _request($champ);


		include_spip('inc/date_gestion');
		$horaire = false;
		$date_debut = verifier_corriger_date_saisie('debut',$horaire,$erreurs);
		$date_fin = verifier_corriger_date_saisie('fin',$horaire,$erreurs);

		$c['date_debut'] = date('Y-m-d H:i:s',$date_debut);
		$c['date_fin'] = date('Y-m-d H:i:s',$date_fin);
	}
/*	else
		$c = $set;

	include_spip('inc/modifier');
	agenda_action_revision_evenement($id_evenement, $c);
	agenda_action_revision_evenement_mots($id_evenement, _request('mots',$set));
	agenda_action_revision_evenement_repetitions($id_evenement,_request('repetitions',$set), _request('mots',$set));

	// Modification de statut, changement de rubrique ?
	$c = array();
	foreach (array(
		'id_parent'
	) as $champ)
		$c[$champ] = _request($champ,$set);
	$err .= agenda_action_instituer_evenement($id_evenement, $c);
*/
	return $err;
}


?>