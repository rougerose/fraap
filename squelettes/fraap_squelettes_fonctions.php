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
		return $matches[0];
	}
}

/**
 * Prend une url et la transforme en supprimant un élément de tableau passé en paramètre.
 * function supprimer
 * @source https://git.spip.net/spip-contrib-squelettes/ressourcotheque/src/branch/master/ressourcotheque_fonctions.php
 * @param url
 * @param param
 * @param tableau_original
 * @param index_element_supprimer
 * @return string
 **/
function parametre_url_supprimer_element_tableau($url, $param, $tableau_original, $index_element_supprimer) {
	$url = parametre_url($url, $param, '');//effacons d'abord
	unset($tableau_original[$index_element_supprimer]);
	$url = parametre_url($url, $param, $tableau_original);
	return $url;
}

/**
 * Recherche : retirer un élément de la liste
 */
function filtre_enleve_tag_liste($liste, $tag) {
	if (!is_array($liste) or !$liste) {
		return $liste;
	}
	$liste = array_unique($liste);
	$liste = array_diff($liste, [$tag]);
	return $liste;
}


function calculer_contexte_recherche_filtres($valeurs = []) {
	if (count($valeurs) > 0) {
		foreach ($valeurs as $cle => $valeur) {
			if ($valeur) {
				$contexte[$cle] = $valeur;
			} else {
				$contexte[$cle] = '';
			}
		}
		return $contexte;
	} else {
		return null;
	}
}
