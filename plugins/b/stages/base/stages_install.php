<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/cextras_gerer');
include_spip('base/stages');

function stages_upgrade($nom_meta_base_version,$version_cible){
	// pour éviter que la colonne activite s'insère dans la table auteurs_elargis du plugin Inscriptions2
	$exceptions_des_champs_auteurs_elargis = pipeline('i2_exceptions_des_champs_auteurs_elargis',array('activite'));
	$champs = stages_declarer_champs_extras();
	installer_champs_extras($champs, $nom_meta_base_version, $version_cible);
}

function stages_vider_tables($nom_meta_base_version) {
	$champs = stages_declarer_champs_extras();
	desinstaller_champs_extras($champs, $nom_meta_base_version);
}
?>