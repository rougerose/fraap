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


	// Stages > zones d'actions :
	// 	- class ui-icon sur tous les boutons ajouter, trier, modifier et supprimer,
	//	- confirmation préalable avant de supprimer,
	//	- le bouton trier fait apparaitre le formulaire,
	//	- les critères de recherche de l'utilisateur sont affichés par spip,
	//	mais on peut les supprimer individuellement et soumettre à nouveau le formulaire.

	$(".actions").each(function(){
		var $boutons = $(this).find("a.bt").addClass("icon"),
			$supprimer = $boutons.filter(".supprimer"),
			$trier = $boutons.filter(".trier"),
			$formulaire_tri_conteneur = $(this).find("#formulaire_tri_stages").hide(),
			$formulaire_tri = $formulaire_tri_conteneur.children("form");

		// critères de recherche utilisateur
		$("#criteres-utilisateur").each(function(){
			var $criteres = $(this).find("dd"),
			//	$champs = $criteres.children("span.data-env"),
				$checkbox = $criteres.filter(".formTypeCheckbox").find("span.data-env"),
				$input = $criteres.filter(".formTypeInput"),
				$tableau_criteres = $.merge($checkbox,$input);

			// ajout bouton de suppression du critère
			$tableau_criteres.map(function(i,el){
				$(el).append("<a href='#champ_"+el.id+"' title='supprimer'> </a>");
				return el;
			});

			var $liens = $tableau_criteres.children("a");
			$liens.click(function(){
				// supprimer le parent immédiat
				$(this).parent().remove();
				// à partir du hash chercher l'élément équivalent dans le formulaire et vider le champs
				$input = $(this.hash);
				if ($input.attr("type") == "text") { $input.val(''); }
				else if ($input.get(0).type == "checkbox") { $input.attr("checked",false); }
				// soumettre à nouveau le formulaire
				$formulaire_tri.submit();
				return false;
			});
		});

		// confirmation préalable avant de supprimer une candidature (page profil)
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

		// afficher le formulaire de tri
		$trier.click(function(){
			$(this).removeAttr("href");
			$(this).toggleClass('ouvert');
			$formulaire_tri_conteneur.slideToggle();
			return false;
		});
	});


	// Stages : affichage du nom du candidat + bouton vers le formulaire de contact
	var stagesContactCandidat = function () {
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
	}
	stagesContactCandidat(); onAjaxLoad(stagesContactCandidat);

});
