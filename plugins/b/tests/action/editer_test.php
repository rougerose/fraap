<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function action_editer_test_dist(){

	$securiser_action = charger_fonction('securiser_action', 'inc');
	$arg = $securiser_action();

	// si id_article n'est pas un nombre, c'est une creation
	// mais on verifie qu'on a toutes les donnees qu'il faut.
	if (!$id_test = intval($arg)) {
		$id_auteur = _request('id_auteur');
		if (!$id_test = tests_action_insert_test($id_auteur))
			return array(false,_L('echec'));
	}

	$err = action_test_set($id_test);
	return array($id_test,$err);
}

// creer un nouvel evenement
function tests_action_insert_test($id_auteur){
/*	include_spip('inc/autoriser');
	if (!autoriser('creerevenementdans','article',$id_article)){
		spip_log("agenda action formulaire article : auteur ".$GLOBALS['visiteur_session']['id_auteur']." n'a pas le droit de creer un evenement dans article $id_article",'agenda');
		return false;
	}
*/
	// nouvel evenement
	$id_test = sql_insertq("spip_tests", array(
		'id_auteur'=>intval($id_auteur),'date'=>date("Y-m-d H:i:s"), "maj"=>date("Y-m-d H:i:s")
		));
	if (!$id_test){
		spip_log("action formulaire test : impossible d'ajouter un test",'journal');
		return false;
	}
	return $id_test;
}


function action_test_set($id_test, $set=null){
	$err = '';

	if (is_null($set)){
		$c = array();
		foreach (array(
			'nom', 'prenom','regions'
		) as $champ)
			$c[$champ] = _request($champ);

	}
	else
		$c = $set;

	$c['regions'] = serialize($c['regions']);

	include_spip('inc/modifier');
	tests_action_revision_test($id_test, $c);
//	agenda_action_revision_evenement_mots($id_evenement, _request('mots',$set));
//	agenda_action_revision_evenement_repetitions($id_evenement,_request('repetitions',$set), _request('mots',$set));

	// Modification de statut, changement de rubrique ?
/*	$c = array();
	foreach (array(
		'id_parent'
	) as $champ)
		$c[$champ] = _request($champ,$set);
	$err .= agenda_action_instituer_evenement($id_evenement, $c);
*/
	return $err;
}

// Enregistre une revision d'evenement
function tests_action_revision_test ($id_test, $c=false) {

/*	if ($c['id_parent']) {
		// Si l'article est publie, invalider les caches et demander sa reindexation
		$t = sql_getfetsel("statut", "spip_articles", "id_article=".intval($c['id_parent']));
		if ($t == 'publie') {
			$invalideur = "id='id_article/$id_article'";
			$indexation = true;
		}
	}
*/
	modifier_contenu('test', $id_test,
		array(
			'nonvide' => array('non' => _T('info_sans_titre'))
		),
		$c);

	return ''; // pas d'erreur
}



/*

function action_editer_test_dist() {
	$securiser_action = charger_fonction('securiser_action', 'inc');
	$arg = $securiser_action();
	// pas de chat ? on en cree un nouveau, mais seulement si 'oui' en argument.
	if (!$id_test = intval($arg)) {
		if ($arg != 'oui') {
		//	include_spip('inc/headers');
		//	redirige_url_ecrire();
		}
		$id_test = insert_test();
	}
	if ($id_test) $err = revisions_tests($id_test);
	return array($id_test,$err);
}
function insert_test() {
	$champs = array(
		'nom' => _T('nouveau nom')
	);

	// Envoyer aux plugins
	$champs = pipeline('pre_insertion', array(
		'args' => array(
			'table' => 'spip_tests',
		),
		'data' => $champs
	));

	$id_test = sql_insertq("spip_tests", $champs);
	return $id_test;
}
// Enregistrer certaines modifications d'un chat
function revisions_tests($id_test, $c=false) {
	// recuperer les champs dans POST s'ils ne sont pas transmis
	if ($c === false) {
		$c = array();
		foreach (array('nom', 'prenom') as $champ) {
			if (($a = _request($champ)) !== null) {
				$c[$champ] = $a;
			}
		}
	}

	include_spip('inc/modifier');
	modifier_contenu('test', $id_test, array(
			'nonvide' => array('nom' => _T('info_sans_titre')),
			'invalideur' => "id='id_test/$id_test'"
		),
		$c);
}

*/

?>