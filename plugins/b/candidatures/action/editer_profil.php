<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function action_editer_profil_dist($arg=null){

//	if (is_null($arg)){

		$securiser_action = charger_fonction('securiser_action', 'inc');
		$arg = $securiser_action();
//	}

	// dans un premier temps, pas d'action pour création de profil.
	// Le formulaire n'étant utilisé que poru modifier.

	spip_log('id_auteur '.$id_auteur.' arg '.$arg,'journal');

	if ($id_auteur = intval($id_auteur))
		$err = auteurs_set($id_auteur);

	return array($id_auteur,$err);

}

// Appelle toutes les fonctions de modification d'un auteur
function auteurs_set($id_auteur, $set = null) {
	$err = '';

	if (is_null($set)){
		$c = array();
		foreach (array(
			'nom','email','activite'
		) as $champ)
			$c[$champ] = _request($champ,$set);
	}
	else{
		$c = $set;
		unset($c['webmestre']);
		unset($c['pass']);
		unset($c['login']);
	}

	include_spip('inc/modifier');
	revision_auteur($id_auteur, $c);

	return $err;
}



?>