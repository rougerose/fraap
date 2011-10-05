<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/cextras_gerer');
include_spip('base/stages');

function stages_upgrade($nom_meta_base_version,$version_cible){
	$champs = stages_declarer_champs_extras();
	installer_champs_extras($champs, $nom_meta_base_version, $version_cible);

	$version_actuelle = '0.0';
	if (
		(!isset($GLOBALS['meta'][$nom_meta_version_base]))
		|| (($version_actuelle = $GLOBALS['meta'][$nom_meta_version_base]) != $version_cible)
	){

		if (version_compare($version_actuelle,'0.0','=')){
			// Création des tables
			include_spip('base/create');
			include_spip('base/abstract_sql');
			creer_base();

			echo "Installation du plugin Stages<br/>";
			ecrire_meta($nom_meta_version_base, $version_actuelle=$version_cible, 'non');
		}
	}
}

function stages_vider_tables($nom_meta_base_version) {
	$champs = stages_declarer_champs_extras();
	desinstaller_champs_extras($champs, $nom_meta_base_version);

	include_spip('base/abstract_sql');

	// On efface les tables du plugin
	sql_drop_table('spip_stages');

	// On efface la version entregistrée
	effacer_meta($nom_meta_version_base);
}
?>