<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function stages_declarer_champs_extras($champs = array()){
	// prénom
	$champs[] = new ChampExtra(array(
		'table' => 'auteur',
		'champ' => 'prenom',
		'label' => 'stages:prenom',
		'rechercher' => '',
		'type' => 'ligne',
		'sql' => "text NOT NULL DEFAULT ''",
		'traitements' => ''
	));

	//activité
	$champs[] = new ChampExtra(array(
		'table' => 'auteur',
		'champ' => 'activite',
		'label' => 'stages:activite',
		'rechercher' => '',
		'type' => 'menu-enum',
		'enum' => "0,stages:type_defaut
		1,stages:type_1
		2,stages:type_2",
		'sql' => "tinytext NOT NULL DEFAULT ''",
		'traitements' => ''
		));

	return $champs;
}
?>