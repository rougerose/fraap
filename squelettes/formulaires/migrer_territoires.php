<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

include_spip('action/editer_liens');

function formulaires_migrer_territoires_charger($data = []) {
	$valeurs = [
		'data' => $data,
	];
	return $valeurs;
}

function formulaires_migrer_territoires_verifier($data = []) {
	$erreurs = [];

	if (count($data['art_mots_departements']) == 0 and count($data['art_mots_regions']) == 0) {
		$erreurs['message_erreur'] = 'Aucun mot-clé Départements et Régions à migrer';
	}

	$solde_art_departements = array_diff($data['art_mots_departements'], $data['art_departements']);
	$solde_art_regions = array_diff($data['art_mots_regions'], $data['art_regions']);

	if (!count($erreurs) and !_request('confirm')) {
		$message = '<strong>Résultats de la prévisualisation</strong><br>';
		$message .= sinon(
			singulier_ou_pluriel(
				count($solde_art_departements),
				'fraap_squelettes:migration_info_preview_departements_singulier',
				'fraap_squelettes:migration_info_preview_departements_pluriel'
			),
			_T('fraap_squelettes:migration_info_departements_aucun')
		) . '<br>';
		$message .= sinon(
			singulier_ou_pluriel(
				count($solde_art_regions),
				'fraap_squelettes:migration_info_preview_regions_singulier',
				'fraap_squelettes:migration_info_preview_regions_pluriel'
			),
			_T('fraap_squelettes:migration_info_regions_aucun')
		) . '<br>';

		$erreurs['confirmer'] = $message;
		$erreurs['message_erreur'] = '';
	}
	return $erreurs;
}

function formulaires_migrer_territoires_traiter($data = []) {
	$res = [];

	// Récupérer les correspondances id_mot -> id_territoire depuis un fichier json
	$json = json_decode(file_get_contents(find_in_path('json/data-mots-territoires.json')), true);

	if ($json === false) {
		return $res['message_erreur'] = 'Le tableau de correspondances mots-clé/territoires est manquant.';
	}
	$correspondances = [];
	foreach ($json as $key => $value) {
		if ($value['id_mot']) {
			$correspondances[$value['id_mot']] = $value['id_territoire'];
		}
	}

	// Récupérer les articles restants à migrer.
	$solde_art_departements = array_diff($data['art_mots_departements'], $data['art_departements']);
	$solde_art_regions = array_diff($data['art_mots_regions'], $data['art_regions']);

	// Récupérer Départements (id_article et id_mot) et associer avec le territoire équivalent
	$from = 'spip_articles AS articles INNER JOIN spip_mots_liens AS L1 ON L1.id_objet = articles.id_article AND L1.objet=' . sql_quote(
		'article'
	) . ' INNER JOIN spip_mots AS L2 ON L2.id_mot = L1.id_mot';

	$where = [
		'articles.statut = ' . sql_quote('publie'),
		'articles.id_rubrique = ' . intval('3'),
		sql_in('articles.id_article', $solde_art_departements),
		'L1.objet = ' . sql_quote('article'),
		'L2.id_groupe = ' . intval('10'),
	];

	$article_departements = sql_allfetsel('articles.id_article, L2.id_mot', $from, $where);

	$nb_departements = 0;

	if (count($article_departements)) {
		foreach ($article_departements as $article) {
			$id_mot = $article['id_mot'];
			if (isset($correspondances[$id_mot])) {
				objet_associer(['territoire' => $correspondances[$id_mot]], ['article' => $article['id_article']]);
				$nb_departements++;
			}
		}
	}

	// idem pour les Régions
	$where = [
		'articles.statut = ' . sql_quote('publie'),
		'articles.id_rubrique = ' . intval('3'),
		sql_in('articles.id_article', $solde_art_regions),
		'L1.objet = ' . sql_quote('article'),
		'L2.id_groupe = ' . intval('1'),
	];
	$article_regions = sql_allfetsel('articles.id_article, L2.id_mot', $from, $where);

	$nb_regions = 0;

	if (count($article_regions)) {
		foreach ($article_regions as $article) {
			$id_mot = $article['id_mot'];
			if (isset($correspondances[$id_mot])) {
				objet_associer(['territoire' => $correspondances[$id_mot]], ['article' => $article['id_article']]);
				$nb_regions++;
			}
		}
	}

	$message = '<strong>Résultats de la migration</strong><br>';
	$message .= sinon(
		singulier_ou_pluriel(
			$nb_departements,
			'fraap_squelettes:migration_info_departements_singulier',
			'fraap_squelettes:migration_info_departements_pluriel'
		),
		_T('fraap_squelettes:migration_info_departements_aucun')
	) . '<br>';
	$message .= sinon(
		singulier_ou_pluriel(
			$nb_regions,
			'fraap_squelettes:migration_info_regions_singulier',
			'fraap_squelettes:migration_info_regions_pluriel'
		),
		_T('fraap_squelettes:migration_info_regions_aucun')
	) . '<br>';

	$res['message_ok'] = $message;

	return $res;
}

// function get_solde($where) {
// 	$solde = [];

// 	if ($ids = sql_allfetsel('id_article', 'spip_articles', $where)) {
// 		foreach ($ids as $id) {
// 			$solde[] = $id['id_article'];
// 		}
// 	}

// 	return $solde;
// }
