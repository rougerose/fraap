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

/**
 * Utiliser le pipeline indexer_document
 * pour ajouter une dimension type document aux articles et fbiblios,
 * et type_ref pour les fbiblios
 */
function fraap_squelettes_indexer_document($flux) {
	if (preg_match('/article|fbiblio/', $flux['args']['objet']) === 1  && $flux['args']['champs']['statut'] == 'publie') {
		$id_rubrique = $flux['args']['champs']['id_rubrique'];
		$flux['data']->properties['typologie'] = ajouter_typologie_document($id_rubrique);

		if ($flux['args']['objet'] == 'fbiblio') {
			$id_fbiblio = $flux['args']['id_objet'];
			$fbiblio = completer_indexation_fbiblio($id_fbiblio);
			$flux['data']->properties['type_ref'] = $fbiblio['type_ref'];
			$flux['data']->properties['annee'] = $fbiblio['annee'];
		}
	}
	return $flux;
}

/**
 * Indexation des documents, ajouter une dimension typologie :
 * 	- fiches pratiques (articles)
 *  - annuaire des membres (articles)
 *  - médiathèque (fbiblios)
 *  - article pour tous les autres articles.
 */
function ajouter_typologie_document($id_rubrique) {
	// fiches pratiques, id_rubrique = 38
	// annuaire membres, id_rubrique = 3
	// médiathèque, id_rubrique = 47
	$id_rubriques = [38, 3, 47];
	$typologie = '';

	if (in_array($id_rubrique, $id_rubriques)) {
		$titre = sql_getfetsel('titre', 'spip_rubriques', 'id_rubrique=' . $id_rubrique);
		$typologie = trim(supprimer_numero($titre));
	} else {
		$typologie = 'article';
	}

	return $typologie;
}

/**
 * Ajouter aux objets fbiblio les données type_ref et année
 */
function completer_indexation_fbiblio($id_fbiblio) {
	if ($id_fbiblio = intval($id_fbiblio)) {
		$complement = sql_allfetsel('type_ref, annee', 'spip_fbiblios', 'id_fbiblio=' . $id_fbiblio);
		return $complement[0];
	} else {
		return [];
	}
}
