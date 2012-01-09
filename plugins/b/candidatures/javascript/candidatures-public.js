jQuery(document).ready(function($) {

	// menu disponible lorsqu'un visiteur est identifié
	// seule la phrase de bienvenu est visible, le reste est masqué
	// et accessible par survol de la souris
	$("#identification-detail").hide();
	$("#menu-identification").hoverIntent( showDetail, hideDetail );

	function showDetail(){
		$(this).find("#identification-detail").slideDown();
	}

	function hideDetail(){
		$(this).find("#identification-detail").slideUp();
	}

	// formulaire_editer : bouton "enregistrer" est masqué tant qu'on a pas saisi ou modifié un champ
	var modifierForm_init = function() {
		$(".formulaire_editer").each(function(){
			var	$bouton = $(this).find('p.boutons'),
				$champs = $('input,' + 'select');
			$bouton.hide();
			$champs.change(function(){
				$bouton.slideDown();
			});
		});
	}
	// il faut que le bouton soit caché après le rechargement du formulaire
	modifierForm_init();
	onAjaxLoad(modifierForm_init);

});

