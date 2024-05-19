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

// Sphinx suggestions
define('_INDEXER_SUGGESTIONS', 5);

// Type de coordonnées par défaut
if (!defined('_COORDONNEES_TYPE_DEFAUT')) {
	define('_COORDONNEES_TYPE_DEFAUT', 'work');
}

// Pays par défaut (en principe défini par Coordonnees)
if (!defined('_COORDONNEES_PAYS_DEFAUT')) {
	define('_COORDONNEES_PAYS_DEFAUT', 'FR');
}

// Spip_wheels : insérer un span.text-underscore sur chaque intertitre de #TEXTE
$GLOBALS['spip_wheels']['raccourcis'][] = 'fraap_squelettes_intertitres';

// Appels de notes
define('_NOTES_OUVRE_REF', '<span class="spip_note_ref">&nbsp;');
define('_NOTES_FERME_REF', '</span>');
define('_NOTES_OUVRE_NOTE', '<span class="spip_note_ref">');
define('_NOTES_FERME_NOTE', '&nbsp;</span>');

// cvtupload - délai avant effacement des fichiers
define('_CVTUPLOAD_AGE_MAX', 24 * 3600 * 5);

// metaplus : pages exclues
if (!defined('_METASPLUS_PAGES_EXCLUES')) {
	define('_METASPLUS_PAGES_EXCLUES', '404');
}
