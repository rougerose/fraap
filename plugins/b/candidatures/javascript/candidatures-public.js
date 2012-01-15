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
	$(".page_profil #extra").each(function(){
		var $tous = $(this).find("div.actions a").addClass("icon"),
			$ajouter = $(this).find("div.actions a.ajouter").attr("title","ajouter");
			$modifier = $(this).find("div.actions a.modifier").attr("title","modifier"),
			$supprimer = $(this).find('div.actions a.supprimer').attr("title","supprimer");

		$supprimer.click(function(){
			var	$lien = $(this).attr('href'),
				$dialog = $('<div></div>').html("<p>Souhaitez-vous continuer ?</p>").dialog({
					autoOpen: false,
					title: "Vous avez demandé la suppression d'une candidature",
					resizable: false,
					width: '460',
					minHeight:'auto',
					modal: true,
					buttons: [{
						text: "Ok",
						class: "bouton small",
						click: function(){ $(this).dialog("close"); location.href  = $lien; }
					},{
						text: "Annuler",
						class: "bouton small",
						click: function(){ $(this).dialog("close"); }
					}]
				});
			$dialog.dialog("open");
			return false;
		});
	});


	// Stages : affichage du nom du candidat + bouton vers le formulaire de contact
	$("#stages-table tbody").each(function(){
		var	i = '',
			$parent = $(this).find("tr:nth-child(odd)"),
			$enfant = $(this).find("tr:nth-child(even) > td > div").hide(),
			$icon = "ui-icon-triangle-1-e",
			$iconSelected = "ui-icon-triangle-1-s",
			$lien = $parent.children("td.expand").html("<a class='icon'></a>"),
			$liens = $parent.find("a.icon").addClass($icon);

		$liens.click(function(){
			var	idx = $liens.index($(this)),
				$visible = $enfant.filter(":visible");
			// un bloc est déjà ouvert ?
			if(!$visible.length == 0) {
				if (i == idx) { // s'agit-il du même bloc ?
					$enfant.eq(idx).slideUp("fast");
				} else { // on ferme celui déjà ouvert et on ouvert celui demandé
					$visible.slideUp("fast");
					$liens.eq(i).toggleClass($icon).toggleClass($iconSelected);
					$enfant.eq(idx).delay(200).slideDown("fast");
					i = idx;
				}
			} else {
				$enfant.eq(idx).slideDown("fast");
				i = idx;
			}
			$(this).toggleClass($icon).toggleClass($iconSelected);
		});
	});


});

