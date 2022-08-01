<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function fraap_theme_recuperer_fond($flux) {
	if ($flux['args']['fond'] == 'javascript/gis.js') {
		$ajout = "\n" . spip_file_get_contents(find_in_path('lib/leaflet-toggle-sleep-map/Leaflet.ToggleSleepMap.js'));
		$flux['data']['texte'] .= $ajout;
	}
	return $flux;
}
