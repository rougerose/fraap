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


	// page profil > candidatures : boutons d'actions "supprimer" et "modifier" :
	// 		class ui-icon sur les boutons "modifier" et "supprimer"
	//		confirmation préalable avant de supprimer
	$("#accordeon-candidatures").each(function(){
		var $tous = $(this).find("div.actions a").addClass("icon"),
			$modifier = $(this).find("div.actions a.modifier").attr("title","modifier"),
			$supprimer = $(this).find('div.actions a.supprimer').attr("title","supprimer");

		$supprimer.click(function(){
			var	$lien = $(this).attr('href'),
				$dialog = $('<div></div>').html("Souhaitez-vous continuer ?").dialog({
					autoOpen: false,
					title: "Vous avez demandé la suppression d'une candidature",
					resizable: false,
					modal: true,
					buttons: {
						"Ok": function(){ $(this).dialog("close"); location.href = $lien; },
						"Annuler": function(){ $(this).dialog("close"); }
					}
				});
			$dialog.dialog("open");
			return false;
		});
	});

});

