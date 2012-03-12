jQuery(document).ready(function() {

	/*
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("#page").toggleClass("gs");
	});


	/*
	* jquery UI Tabs
	*/
	$(".tabs, #annuaire-contact, #formulaire_tri_criteres").tabs();


	/*
	* jquery UI accordeon
	*/
	/* page profil : liste des candidatures enregistrées */
	$("#accordeon-candidatures").accordion({
		autoHeight: false,
		icons:false
	});
	// Rubrique Ressources
	$("#ressources").accordion({
		header:'dt',
		autoHeight: false,
		icons:false,
		navigation:true,
		// on se met doucement là où il faut http://stackoverflow.com/a/3621845
		change: function(event,ui) {
			$.scrollTo(ui.newHeader,500);
		}
	});
		// le hash s'ajoute dans l'url de la page, ce qui permet de pointer plus précisément
		// http://michaeljacobdavis.com/tutorials/statesavingaccordion.html
		$("#ressources a.theme").click(function(event){
			window.location.hash=this.hash;
		});

		$.localScroll.hash();

	/*
	* Rubrique annuaire : formulaire de tri
	* le bouton ok est masqué et le rechargement de la page est géré sur onchange des select
	*/
	$("#formulaire_tri_annuaire .boutons").hide();

	/*
	* Animation du formulaire Recherche
	*/
	var rechercheFormAnim = function (){

	}

//	rechercheFormAnim(); onAjaxLoad(rechercheFormAnim);

});

var my_lib =
{
	recherche :
	{
		init: function()
		{
			$("#formulaire_recherche").each(function(){
				var $recherche = $(this),
					$slide = $recherche.find("form").hide(),
					$ul = $recherche.next("ul").addClass("ok"),
					compteur = 0;
				$ul.prepend('<li class="recherche filets"><a href="#">Recherche</a></li>');
				var $bouton = $ul.find(".recherche");

				// animation du bouton
				$bouton.hover(
					function(){
						$(this).stop().animate({ borderTopWidth: '10px' }, 'normal');
					}
					,
					function(){
						if ($(this).hasClass("on")) { return false; }
						else {
							$(this).stop().animate({ borderTopWidth:'4px' }, 'normal');
						}
					}
				);

				// et le clic
				$bouton.click(function(){
					$(this).addClass("on").animate({ borderTopWidth:'10px' }, 'normal');
					compteur ++;
					$slide.slideToggle("normal", function(){
						if (compteur %2 == 0) {
							$bouton.removeClass("on").stop().animate({borderTopWidth: '4px'}, "fast");
						 }
						else {
							$bouton.stop().animate({borderTopWidth: '10px'},"fast").addClass("on");
						}
					});
					$ul.find(">li").slice(1).toggleClass("marge");
				});
				// le formulaire est affiché par défaut sur la page de recherche
				if ($("body.page_recherche").length) { $bouton.trigger("click"); }
			});
		}
	}
}


