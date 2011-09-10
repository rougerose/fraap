<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function stages_declarer_champs_extras($champs = array()){
	// pour éviter que la colonne activite s'insère dans la table auteurs_elargis du plugin Inscriptions2
	$exceptions_des_champs_auteurs_elargis = pipeline('i2_exceptions_des_champs_auteurs_elargis',array('activite'));
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