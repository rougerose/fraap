<?php


include_spip('inc/cextras_autoriser');
// restreindre l'affichage champs extra sur les articles de l'annuaire (rubrique 3)
// voir http://www.spip-contrib.net/Champs-Extras-2
restreindre_extras('article', array('site', 'contact'), 3);

?>