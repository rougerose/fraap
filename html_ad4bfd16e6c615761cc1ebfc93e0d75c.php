<?php

/*
 * Squelette : extensions/porte_plume/barre_outils_icones.css.html
 * Date :      Wed, 06 Apr 2011 20:32:02 GMT
 * Compile :   Thu, 03 Nov 2011 16:22:36 GMT
 * Boucles :   
 */ 
//
// Fonction principale du squelette extensions/porte_plume/barre_outils_icones.css.html
// Temps de compilation total: 0.562 ms
//

function html_ad4bfd16e6c615761cc1ebfc93e0d75c($Cache, $Pile, $doublons=array(), $Numrows=array(), $SP=0) {


	if (isset($Pile[0]["doublons"]) AND is_array($Pile[0]["doublons"]))
		$doublons = nettoyer_env_doublons($Pile[0]["doublons"]);

	$connect = '';
	$page = (
'<?php header("X-Spip-Cache: 604800"); ?>' .
'<'.'?php header("' . 'Content-Type: text/css; charset=utf-8' . '"); ?'.'>' .
'<'.'?php header("' . 'Vary: Accept-Encoding' . '"); ?'.'>' .
barre_outils_css_icones('') .
'

/* roue ajax */
.ajaxLoad{background:white url(\'' .
interdire_scripts(url_absolue(find_in_path('images/searching.gif'))) .
'\') top left no-repeat;}
');

	return analyse_resultat_skel('html_ad4bfd16e6c615761cc1ebfc93e0d75c', $Cache, $page, 'extensions/porte_plume/barre_outils_icones.css.html');
}
?>