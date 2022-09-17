<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}


/**
 * Les données recherche et filtres sont envoyées à Sphinx via la fonction charger
 * du formulaire de filtre. Si l'on utilise la méthode squelettes, les données contenant
 * notamment une apostrophe sont systématiquement converties et fausse les résultats
 * dans la fenêtre des filtres.
 */
function formulaires_recherche_filtres_charger($recherche = '', $criteres = [], $redirect = '') {
	$datas = [];
	$retour = [
		'recherche' => $recherche,
		'btnOpen' => _request('btnOpen'),
	];

	if (strlen($recherche)) {
		include_spip('inc/fraap_squelettes');
		// Calculer les contextes pour les filtres et le total des résultats.
		$contexte_filtres = [];
		$contexte_total = [];

		foreach ($criteres as $key => $valeurs) {
			$contexte_filtres = calculer_contexte_recherche_filtres($valeurs);
			if ($contexte_filtres) {
				$cle = $valeurs['cle']; // tags, origine, annee
				$type = $valeurs['type']; // type multiple ou unique ?
				$retour[$cle] = _request($cle); // récupérer les filtres saisis/supprimés par l'utilisateur

				// La saisie de l'utilisateur est prioritaire
				$contexte_filtres[$cle] = $retour[$cle];
				$contexte_total[$cle] = $retour[$cle];

				$contexte_filtres['recherche'] = $recherche;
				$datas[$key]['cle'] = $cle;
				// Récupérer les facettes depuis un squelette
				$datas[$key]['data'] = unserialize(recuperer_fond('inclure/formulaires/filtres-facette', $contexte_filtres));
				$datas[$key]['titre'] = $valeurs['titre'];
				$datas[$key]['type'] = $valeurs['type'];
			}
		}
		$contexte_total['recherche'] = $recherche;
		$retour['total'] = recuperer_fond('inclure/formulaires/filtres-total', $contexte_total);
	}
	$retour['datas'] = $datas;
	return $retour;
}

function formulaires_recherche_filtres_verifier($recherche = '', $criteres = [], $redirect = '') {
	$erreurs = [];
	return $erreurs;
}

function formulaires_recherche_filtres_traiter($recherche = '', $criteres = [], $redirect = '') {
	$retour = [];
	$voir_resultats = _request('voir_resultats');

	if ($voir_resultats) {
		foreach ($criteres as $key => $valeurs) {
			$cle = $valeurs['cle'];
			$retour[$cle] = _request($cle);
			$redirect = parametre_url($redirect, $cle, '');

			if (is_array($retour[$cle])) {
				$retour[$cle] = array_unique($retour[$cle]);
				if (count($retour[$cle]) > 0) {
					$redirect = parametre_url($redirect, $cle, $retour[$cle]);
				}
			} else {
				if ($retour[$cle]) {
					$redirect = parametre_url($redirect, $cle, $retour[$cle]);
				}
			}
		}
		$retour['redirect'] = $redirect;
		$retour['message_ok'] = '<script type="text/javascript">if (window.jQuery) ajaxReload("recherche");</script>';
	}
	$retour['editable'] = true;
	return $retour;
}
