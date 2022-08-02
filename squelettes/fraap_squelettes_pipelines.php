<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

/**
 * Modifier la liste des réseaux disponibles :
 * - garder les 3 principaux
 * - ajouter l'url d'un site web
 *
 * L'ajout d'un site permet de mutualiser
 * dans un unique formulaire tous les sites/rézos
 * d'un même tiers.
 *
 */
function fraap_squelettes_rezosocios_liste($flux) {
	if (is_array($flux)) {
		$rezos = [
			'facebook' => $flux['facebook'],
			'twitter' => $flux['twitter'],
			'instagram' => $flux['instagram'],
			'site' => ['nom' => 'Site web', 'url' => ''],
		];

		$flux = $rezos;
	}
	return $flux;
}

/**
 * Modifier les saisies adresse/email/téléphone :
 *  - suppression du titre
 *  - type "professionnel" par défaut
 *
 * @param  array $flux Le flux du pipeline
 * @return array       Le flux modifié
 */
function fraap_squelettes_formulaire_saisies($flux) {
	$forms = ['editer_adresse', 'editer_email', 'editer_numero'];

	if (in_array($flux['args']['form'], $forms)) {
		include_spip('inc/saisies');
		// $flux['data'] = saisies_supprimer($flux['data'], 'titre');
		$flux['data'] = saisies_modifier(
			$flux['data'],
			'type',
			['options' => ['defaut' => _COORDONNEES_TYPE_DEFAUT]]
		);
	}
	return $flux;
}


/**
 * Ajouter automatiquement le titre de l'article
 * lors de l'édition d'une adresse, d'un mail ou d'un numéro.
 */
function fraap_squelettes_formulaire_charger($flux) {
	$forms = ['editer_adresse', 'editer_email', 'editer_numero'];
	$form = $flux['args']['form'];

	if (in_array($form, $forms)) {
		$titre = $flux['data']['titre'];
		$id_article = intval(_request('id_article'));

		if ($titre == '' and $id_article) {
			$f = $flux;
			// A priori les coordonnées sont ajoutées uniquement aux articles
			$titre = sql_getfetsel('titre', 'spip_articles', 'id_article=' . $id_article);
			$flux['data']['titre'] = $titre;
		}
	}
	return $flux;
}
