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

	// if (strpos($form, 'recherche') !== 1 && isset($flux['data']['class']) && in_array($flux['data']['class'], ['annuaire', 'mediatheque'])) {
	// 	$action = parametre_url($flux['data']['action'], 'page|id_rubrique', '');
	// 	$flux['data']['action'] = $action;
	// }

	return $flux;
}

/**
 * Pipeline gis_modele_parametres_autorises
 * Autoriser l'ajout d'un tableau d'id_article
 */
function fraap_squelettes_gis_modele_parametres_autorises($flux) {
	array_push($flux, 'articles');
	return $flux;
}


/**
 * Pipeline indexer_document
 * - pour l'objet Fbiblio : ajout de type_ref et de l'année.
 * - pour les articles : ajout de la dimension Typologie,
 *   qui permet dans les filtres de Recherche de trier soit par articles,
 *   soit par le titre de la rubrique parente (fiches pratiques, annuaire
 *   membres, médiathèque).
 * - pour les articles de l'annuaire membres : ajouter les territoires (départements et régions).
 */
function fraap_squelettes_indexer_document($flux) {
	if (preg_match('/article|fbiblio/', $flux['args']['objet']) === 1  && $flux['args']['champs']['statut'] == 'publie') {
		$id_rubrique = $flux['args']['champs']['id_rubrique'];

		// Préciser la typologie de l'article
		$flux['data']->properties['typologie'] = indexation_ajouter_typologie_document($id_rubrique);

		// Compléter l'objet Fbiblio
		if ($flux['args']['objet'] == 'fbiblio') {
			$id_fbiblio = $flux['args']['id_objet'];
			$fbiblio = indexation_completer_fbiblio($id_fbiblio);
			$flux['data']->properties['type_ref'] = $fbiblio['type_ref'];
			$flux['data']->properties['annee'] = $fbiblio['annee'];
		}

		// Départements et régions
		if ($flux['args']['objet'] == 'article' && $id_rubrique == 3) {
			$id_article = $flux['args']['id_objet'];
			if (
				$territoires = sql_allfetsel(
					'*',
					'spip_territoires as a join spip_territoires_liens as l on a.id_territoire=l.id_territoire',
					['l.objet=' . sql_quote('article'), 'l.id_objet=' . intval($id_article)]
				)
			) {
				foreach ($territoires as $territoire) {
					$categorie = $territoire['categorie'];
					$id_territoire = intval($territoire['id_territoire']);
					$titre = extraire_multi($territoire['iso_titre'], 'fr');

					// Créer les champs Départements et Régions si nécessaire
					foreach (['departements', 'regions'] as $k) {
						if (empty($flux['data']->properties[$k])) {
							$flux['data']->properties[$k] = [];
						}
					}



					// Départements
					// Vérifier que le territoire n'est pas déjà enregistré
					if (!in_array($id_territoire, $flux['data']->properties['departements'])) {
						$departements = [];
						if (preg_match('/metropolitan_department/', $categorie) === 1) {
							// Cas général
							$departements[] = $id_territoire;
						} elseif (preg_match('/metropolitan_collectivity/', $categorie) === 1 && in_array($titre, ['Paris', 'Lyon'])) {
							// Cas Paris, Lyon
							$departements[] = $id_territoire;
						} elseif (preg_match('/overseas_departmental_collectivity/', $categorie) === 1) {
							// Cas Mayotte, Réunion et Guadeloupe
							$departements[] = $id_territoire;
						} elseif (preg_match('/overseas_unique_territorial_collectivity/', $categorie) === 1) {
							// Cas Martinique et Guyane
							$departements[] = $id_territoire;
						}

						if (in_array($id_territoire, $departements)) {
							$flux['data']->properties['departements'] = array_merge($flux['data']->properties['departements'], $departements);
						}
					}

					// Régions
					// Vérifier que le territoire n'est pas déjà enregistré
					if (!in_array($id_territoire, $flux['data']->properties['regions'])) {
						$regions = [];
						if (preg_match('/metropolitan_region/', $categorie) === 1) {
							// Cas général
							$regions[] = $id_territoire;
						} elseif (preg_match('/metropolitan_collectivity/', $categorie) === 1 && strpos($titre, 'Corse') !== false) {
							// Cas Corse
							$regions[] = $id_territoire;
						} elseif (preg_match('/overseas/', $categorie) === 1) {
							// Cas outre-mer
							$regions[] = $id_territoire;
						}

						if (in_array($id_territoire, $regions)) {
							$flux['data']->properties['regions'] = array_merge($flux['data']->properties['regions'], $regions);
						}
					}
				}
			}
		}
	}
	return $flux;
}

/**
 * Ajouter aux objets fbiblio les données type_ref et année
 */
function indexation_completer_fbiblio($id_fbiblio) {
	if ($id_fbiblio = intval($id_fbiblio)) {
		$complement = sql_allfetsel('type_ref, annee', 'spip_fbiblios', 'id_fbiblio=' . $id_fbiblio);
		return $complement[0];
	} else {
		return [];
	}
}

/**
 * Indexation des documents, ajouter une dimension typologie :
 * 	- fiches pratiques (articles)
 *  - annuaire des membres (articles)
 *  - médiathèque (fbiblios)
 *  - article pour tous les autres articles.
 */
function indexation_ajouter_typologie_document($id_rubrique) {
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
