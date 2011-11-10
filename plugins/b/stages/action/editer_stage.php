<?php
if (!defined("_ECRIRE_INC_VERSION")) return;
/*
	TODO à terminer
*/
function action_editer_stage_dist() {
	$securiser_action = charger_fonction('securiser_action', 'inc');
	$arg = $securiser_action();
	// pas de stage ? on en cree un nouveau, mais seulement si 'oui' en argument.
	if (!$id_formulaires_reponse = intval($arg)) {
		if ($arg != 'oui') {
			include_spip('inc/headers');
		//	redirige_url_ecrire();
		}
		$id_formulaires_reponse = insert_chat();
	}
	if ($id_formulaires_reponse) $err = revisions_stages($id_formulaires_reponse);
	return array($id_formulaires_reponse,$err);
}
function insert_stage() {
	$champs = array(
	//	'nom' => _T('chats:item_nouveau_chat')
	);

	// Envoyer aux plugins
	$champs = pipeline('pre_insertion', array(
		'args' => array(
			'table' => 'spip_stages',
		),
		'data' => $champs
	));

	$id_formulaires_reponse = sql_insertq("spip_stages", $champs);
	return $id_formulaires_reponse;
}
// Enregistrer certaines modifications d'un stage
function revisions_stages($id_formulaires_reponse, $c=false) {
	// recuperer les champs dans POST s'ils ne sont pas transmis
	if ($c === false) {
		$c = array();
		foreach (array('nom', 'race', 'robe', 'annee_naissance', 'infos') as $champ) {
			if (($a = _request($champ)) !== null) {
				$c[$champ] = $a;
			}
		}
	}

	include_spip('inc/modifier');
	modifier_contenu('chat', $id_chat, array(
			'nonvide' => array('nom' => _T('info_sans_titre')),
			'invalideur' => "id='id_chat/$id_chat'"
		),
		$c);
}
?>