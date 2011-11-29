<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/meta');
include_spip('base/create');

function stages_upgrade($nom_meta_base_version, $version_cible){

	$current_version = "0.0";

	if (isset($GLOBALS['meta'][$nom_meta_base_version])) {
		$current_version = $GLOBALS['meta'][$nom_meta_base_version];
	}

	if ($current_version=="0.0") {
		creer_base();
		maj_tables('spip_auteurs');
		ecrire_meta($nom_meta_base_version, $current_version=$version_cible);
	}
/*
	if (version_compare($current_version,"0.2","<")){
		include_spip('base/abstract_sql');
		spip_log("version courante2 ".$current_version);
		// ajout des champs prenom et activite sur la table auteurs
		sql_alter("TABLE spip_auteurs ADD prenom text NOT NULL");
		sql_alter("TABLE spip_auteurs ADD activite tinytext NOT NULL");
		ecrire_meta($nom_meta_base_version,$current_version="0.3");
	}
*/
}

function stages_vider_tables($nom_meta_base_version) {
	include_spip('base/abstract_sql');
	sql_drop_table("spip_stages");
	sql_alter("TABLE spip_auteurs DROP COLUMN prenom");
	sql_alter("TABLE spip_auteurs DROP COLUMN activite");
	effacer_meta($nom_meta_base_version);
}



?>
