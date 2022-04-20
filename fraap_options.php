<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

// Zcore
if (!isset($GLOBALS['z_blocs'])) {
	$GLOBALS['z_blocs'] = [
		'contenu',
		'head',
		'head_js',
		'header',
		'footer',
		'titre',
		'navigation',
		'extra',
		'fil',
	];
}

$GLOBALS['debut_intertitre'] = '<h2 class="spip">';
$GLOBALS['fin_intertitre'] = '</h2>';
