<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

// Zcore
if (!isset($GLOBALS['z_blocs'])) {
	$GLOBALS['z_blocs'] = [
		'content',
		'head',
		'head_js',
		'header',
		'footer',
	];
}

// Premier niveau d'intertitre
$GLOBALS['debut_intertitre'] = '<h2>';
$GLOBALS['fin_intertitre'] = '</h2>';

// Seuil à partir duquel la liste des mots-clés devient un formulaire de recherche
define('_MAX_MOTS_LISTE', 150);

define('_SURLIGNE_RECHERCHE_REFERERS', true);
if (isset($_REQUEST['recherche'])) {
  $_GET['var_recherche'] = $_REQUEST['recherche'];
}
