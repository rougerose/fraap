
jQuery(document).ready(function() {
// eviter un FOUC http://www.learningjquery.com/2008/10/1-way-to-avoid-the-flash-of-unstyled-content
$('html').addClass('js');

	/*
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	// $("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	// $("#grille").click(function(){
	// 	$("#page").toggleClass("gs");
	// });


	/*
	* jquery UI Tabs
	*/
	$(".tabs, #annuaire-contact, #formulaire_tri_criteres").tabs();


	/*
	* jquery UI accordeon
	*/
	// Page Annuaire
	

	/* page profil : liste des candidatures enregistrées */
	$("#accordeon-candidatures").accordion({
		autoHeight: false,
		icons:false
	});

	// Rubrique Ressources
	if ($("#ressources").length) {

		$("#ressources").accordion({
			header:'dt',
			autoHeight: false,
			icons:false,
			navigation:true
		});
		// le hash s'ajoute dans l'url de la page, ce qui permet de pointer plus précisément
		// http://michaeljacobdavis.com/tutorials/statesavingaccordion.html
		$("#ressources a.theme").click(function(event){
			window.location.hash=this.hash;
		});

		$('#ressources dt').bind('click',function(){
			var self = this;
      setTimeout(function() {
				var off = $(self).offset();
				console.log(off);
        // $('body,html').animate({ scrollTop: offset.top - 100 });
				$('body').animate({scrollTop: off.top});
      }, 310);
    });
	}

	/*
	* Rubrique annuaire : formulaire de tri
	* le bouton ok est masqué et le rechargement de la page est géré sur onchange des select
	*/
	// $("#formulaire_tri_annuaire .boutons").hide();



});

var public_jslib =
{
	// formulaire de recherche
	recherche :
	{
		init: function()
		{
			$("#formulaire_recherche").each(function(){
				var $recherche = $(this),
					$slide = $recherche.find("form"),//.hide(),
					$ul = $recherche.next("ul"),
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
