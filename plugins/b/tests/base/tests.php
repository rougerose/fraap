<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function tests_declarer_tables_interfaces($interface){
	$interface['table_des_tables']['tests'] = 'tests';
//	$interface['table_des_traitements']['RACE']['chats'] = _TRAITEMENT_TYPO;
	return $interface;
}
function tests_declarer_tables_principales($tables_principales){
	$tests = array(
		"id_test" => "bigint(21) NOT NULL",
		"id_auteur" => "bigint(21) NOT NULL",
		"maj" 		=> "timestamp",
		"nom" => "text NOT NULL",
		"prenom"		=> "text NOT NULL",
		"regions" => "text NOT NULL"
		);

	$tests_cles = array(
		"PRIMARY KEY"	=> "id_test",
		"KEY id_auteur" => "id_auteur"
		);

	$tables_principales['spip_tests'] = array(
		'field' => &$tests,
		'key' => &$tests_cles,
		'join' => array('id_auteur' => 'id_auteur')
	);

	return $tables_principales;
}

?>
