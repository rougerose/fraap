<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function stages_declarer_tables_interfaces($interface){
	$interface['table_des_tables']['stages'] = 'stages';
//	$interface['table_des_traitements']['RACE']['chats'] = _TRAITEMENT_TYPO;
	return $interface;
}
function stages_declarer_tables_principales($tables_principales){
	$stages = array(
		"id_stage"	=> "bigint(21) NOT NULL",
		"id_auteur" => "bigint(21) NOT NULL",
		"statut" 	=> "varchar(10) NOT NULL",
		"date"		=> "datetime NOT NULL",
		"maj" 		=> "timestamp",
		"regions"	=> "text NOT NULL",
		"ville_stage" => "text NOT NULL",
		"date_debut" => "date NOT NULL",
		"date_fin"	=> "date NOT NULL",
		"ecole"		=> "text NOT NULL",
		"ville_ecole" => "text NOT NULL",
		"diplome"	=> "text NOT NULL",
		"niveau"	=> "text NOT NULL",
		"competences_offre" => "text NOT NULL",
		"competences_recherche" => "text NOT NULL",
		"maj"		=> "TIMESTAMP"
		);

	$stages_cles = array(
		"PRIMARY KEY"	=> "id_stage",
		"KEY id_auteur" => "id_auteur"
		);

	$tables_principales['spip_stages'] = array(
		'field' => &$stages,
		'key' => &$stages_cles,
		'join' => array('id_auteur' => 'id_auteur')
	);

	$tables_principales['spip_auteurs']['field']['prenom'] = 'text NOT NULL DEFAULT ""';
	$tables_principales['spip_auteurs']['field']['activite'] = 'text NOT NULL DEFAULT ""';

	return $tables_principales;
}

?>
