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
define('_MAX_MOTS_LISTE', 300);

// Recherche
define('_SURLIGNE_RECHERCHE_REFERERS', true);
if (isset($_REQUEST['recherche'])) {
  $_GET['var_recherche'] = $_REQUEST['recherche'];
}

// Type de coordonnées par défaut
if (!defined('_COORDONNEES_TYPE_DEFAUT')) {
	define('_COORDONNEES_TYPE_DEFAUT', 'work');
}

// Pays par défaut (en principe défini par Coordonnees)
if (!defined('_COORDONNEES_PAYS_DEFAUT')) {
	define('_COORDONNEES_PAYS_DEFAUT', 'FR');
}

$GLOBALS['spip_wheels']['raccourcis'][] = 'fraap_squelettes_intertitres';
