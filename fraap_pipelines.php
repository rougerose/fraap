<?php

if (!defined('_ECRIRE_INC_VERSION')) return;

// jquery ui tabs
function fraap_jqueryui_plugins($scripts){
   $scripts[] = "jquery.ui.tabs";
   $scripts[] = "jquery.ui.accordion";
   return $scripts;
}

function fraap_insert_head($flux) {
  $dossier = 'javascript/';
  $scripts = array(
		// script
		'public.js',
    'public_init.js'
  );
  foreach($scripts as $valeur) {
    $flux .="\n".'<script src="'.find_in_path($dossier.$valeur).'" type="text/javascript"></script>';
  }
  return $flux;
}

?>
