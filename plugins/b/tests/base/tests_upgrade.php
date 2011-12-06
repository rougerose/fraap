<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/meta');
include_spip('base/create');

function tests_upgrade($nom_meta_base_version, $version_cible){

	$current_version = "0.0";

	if (isset($GLOBALS['meta'][$nom_meta_base_version])) {
		$current_version = $GLOBALS['meta'][$nom_meta_base_version];
	}

	if ($current_version=="0.0") {
		creer_base();
		ecrire_meta($nom_meta_base_version, $current_version=$version_cible);
	}
	if (version_compare($current_version,'0.2','<')){
		sql_alter("TABLE spip_tests ADD regions text DEFAULT NOT NULL");
		ecrire_meta($nom_meta_base_version,$current_version="0.2",'non');
	}
}

function tests_vider_tables($nom_meta_base_version) {
	include_spip('base/abstract_sql');
	sql_drop_table("spip_tests");
	effacer_meta($nom_meta_base_version);
}



?>
