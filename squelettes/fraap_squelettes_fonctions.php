<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

/**
 * Filtre supplémentaire au sommaire :
 * ajouter les styles .toc
 */
function ajouter_styles_toc($texte) {
	if (strpos($texte, '<ul class="spip">') !== false) {
		$texte = preg_replace('/<ul class="spip">/Uims', '<ul class="spip toc_list" role="list">', $texte);
	}
	if (strpos($texte, '<li>') !== false) {
		$texte = preg_replace('/<li>/', '<li class="toc_item">', $texte);
	}
	return $texte;
}

/**
 * Filtre supplémentaire au sommaire :
 * Supprimer les span.text-underline ajoutés aux intertitres de #TEXTE
 */
function supprimer_soulignement($texte) {
	if (strpos($texte, '<span class="text-underline">') !== false) {
		$texte = preg_replace_callback('/(<[a]+[^>]*>)(.*?)(<\/a>)/', 'callback_supprimer_span', $texte);
	}
	return $texte;
}

function callback_supprimer_span($matches) {
	if (strpos($matches[2], '<span') !== false) {
		return $matches[1] . strip_tags($matches[2]) . $matches[3];
	} else {
		return '';
	}
}
