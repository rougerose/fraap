<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

function formulaires_recherche_filtres_charger($recherche = '', $criteres = [], $redirect = '') {
	$datas = [];
	$retour = [
		'recherche' => $recherche,
		'btnOpen' => _request('btnOpen'),
	];

	if (strlen($recherche)) {
		include_spip('inc/fraap_squelettes');
		$contexte_total = [];

		foreach ($criteres as $key => $valeurs) {
			$contexte = calculer_contexte_recherche_filtres($valeurs);
			if ($contexte) {
				$cle = $valeurs['cle'];
				$type = $valeurs['type'];
				$retour[$cle] = _request($cle);
				// Prendre en compte les filtres ajoutés/supprimés par l'utilisateur
				$contexte[$cle] = $retour[$cle];
				$contexte_total[$cle] = $retour[$cle];

				$contexte['recherche'] = $recherche;
				$datas[$key]['cle'] = $cle;
				$datas[$key]['data'] = unserialize(recuperer_fond('inclure/formulaires/filtres-facette', $contexte));
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
