<?php
function candidatures_insert_head($texte){
	$texte .= '<script type="text/javascript" src="'.find_in_path('javascript/jquery.hoverIntent.minified.js').'"></script>'."\n";
	$texte .= '<script type="text/javascript" src="'.find_in_path('javascript/candidatures-public.js').'"></script>'."\n";
	return $texte;
}
?>