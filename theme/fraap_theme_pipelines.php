<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function fraap_theme_insert_head_css($flux): string {
	/**
	 * 	Insertion CSS publiques en version min ou pas, selon le contexte dev ou prod
	 * 	Source : https://git.spip.net/spip-contrib-extensions/markdown_editor/-/blob/master/markdown_editor_pipelines.php?ref_type=heads#L7
	 */
	$css = timestamp(find_in_path('dist/css/fraap.min.css')) ?: timestamp(find_in_path('dist/css/fraap.css'));

	if ($css) {
		$flux .= '<link rel="stylesheet" href="' . url_absolue($css) . '" type="text/css"/>';
	}

	return $flux;
}
