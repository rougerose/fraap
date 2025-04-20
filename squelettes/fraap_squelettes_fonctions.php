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
 * Supprimer les span.text-underline copiés collés dans le sommaire
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
	}
	return $matches[0];

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

/**
 * Trier un tableau multidimensionnel selon une clé déterminée.
 */
function filtre_trier_selon_cle($tableau, $cle, $sens) {
	$k = array_column($tableau, $cle);

	if ($sens == 'DESC') {
		array_multisort($k, SORT_DESC, $tableau);
	} else {
		array_multisort($k, SORT_ASC, $tableau);
	}

	return $tableau;
}

/**
 * Adapter les ancres ajoutées par le plugin Sommaire.
 */
function adapter_ancres($texte) {
	$t = $texte;
	preg_match_all(',(<h([123456])[^>]*>)(.*)(</h\\2>),Uims', $texte, $matches, PREG_SET_ORDER);

	if (!count($matches)) {
		return $texte;
	}

	$currentpos = 0;

	foreach ($matches as $m) {
		if (($pos = strpos($texte, $m[0], $currentpos)) !== false) {
			// Supprimer l'ancre ajoutée par défaut
			// et rétablir le span ajouté par wheels/fraap_squelettes_intertitres
			$titre = wrap(supprimer_tags($m[3]), '<span class="text-underline">');
			// Récupérer l'identifiant
			$ancre = extraire_attribut($m[1], 'id');
			// Modifier l'ancre de l'intertitre
			$h = ajouter_class($m[1], 'intertitre') . $titre . " <a href='#$ancre' class='intertitre_ancre'>#</a>" . $m[4];
			// Insérer l'intertitre modifié
			$texte = substr_replace($texte, $h, $pos, strlen($m[0]));
			$currentpos = $pos + strlen($h);
		}
	}

	return $texte;
}
