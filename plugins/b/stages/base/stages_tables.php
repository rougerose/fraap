<?php

// Sécurité
if (!defined("_ECRIRE_INC_VERSION")) return;

function stages_declarer_tables_interfaces($interface){
	// 'spip_' dans l'index de $tables_principales
	$interface['table_des_tables']['stages'] = 'stages';
	return $interface;
}

function stages_declarer_tables_principales($tables_principales){
	//-- Table formulaires -----------------------------------------------------
	$stages = array(
		"id_formulaires_reponse" => "bigint(21) NOT NULL",
		"regions" => "text NOT NULL",
		"ville_stage" => "text NOT NULL",
		"date_debut" => "date NOT NULL",
		"date_fin" => "date NOT NULL",
		"ecole" => "text NOT NULL",
		"ville_ecole" => "text NOT NULL",
		"diplome" => "text NOT NULL",
		"niveau" => "text NOT NULL",
		"competences" => "text NOT NULL",
		"recherches" => "text NOT NULL",
	);
	$stages_cles = array(
		"PRIMARY KEY" => "id_formulaires_reponse"
	);
	$tables_principales['spip_stages'] = array(
		'field' => &$stages,
		'key' => &$stages_cles,
		'join'=> array(
			'id_formulaires_reponse' => 'id_formulaires_response'
		)
	);

	return $tables_principales;
}
?>