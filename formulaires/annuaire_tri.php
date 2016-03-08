<?php

function formulaires_annuaire_tri_charger($articles = null, $url = null) {
  return array(
    'id_articles' => $articles,
    'mots' => _request('mots'),
    'id_rubrique' => _request('id_rubrique'),
    'page' => _request('page')
  );
}

function formulaires_annuaire_tri_verifier($articles = null, $url = null) {
  $erreurs = array();
  return $erreurs;
}

function formulaires_annuaire_tri_traiter($articles = null, $url = null) {
  refuser_traiter_formulaire_ajax();
  $mots = _request('mots');
  // supprimer les valeurs vides du tableau mots
  $mots = array_filter($mots, function($a){
    return is_string($a) && trim($a) !== "";
  });
  if (!$url) {
    $url = self();
  }
  // Nettoyer l'URL des mots[] qu'elle contiendrait deja
  $url = parametre_url($url,'mots','');
  $url = parametre_url($url, 'mots', $mots);
	return array('redirect' => $url);
}

?>
