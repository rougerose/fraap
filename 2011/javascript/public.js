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
	$("#tabs").tabs();


	/*
	* jquery UI accordeon
	*/
	/* page profil : liste des candidatures enregistrées */
	$("#accordeon-candidatures").accordion({
		autoHeight: false
	});


	/*
	* Stages
	*/
	/* Afficher/masquer le nom du candidat et le bouton d'envoi de message mail */

/*	$("#stages-table").each(function(){
		var $expand = $(this).find(".expand");

		$expand.addClass("ui-icon ui-icon-circle-plus");
	});

*/



	/*
	* Animation du formulaire Recherche
	*/
	$("#formulaire_recherche").each(function(){
		var $recherche = $(this),
			$slide = $recherche.find("form"),
			$ul = $recherche.next("ul").addClass("ok");
			compteur = 0;
		$ul.prepend('<li class="recherche filets"><a href="#">recherche</a></li>');
		var $bouton = $ul.find(".recherche");

		$slide.hide();

		// animation du bouton
		$bouton.hover(
			function(){
				$(this).stop().animate({ borderTopWidth: '8px' }, 'normal');
			}
			,
			function(){
				if ($(this).hasClass("on")) { return false; }
				else {
					$(this).stop().animate({ borderTopWidth:'2px' }, 'normal');
				}
			}
		);

		// et le clic
		$bouton.click(function(){
			$(this).addClass("on").animate({ borderTopWidth:'8px' }, 'normal');
			compteur ++;
			$slide.slideToggle("normal", function(){
				if (compteur %2 == 0) {
					$bouton.removeClass("on").stop().animate({borderTopWidth: '2px'}, "fast");
				 }
				else {
					$bouton.stop().animate({borderTopWidth: '8px'},"fast").addClass("on");
				}
			});
			$ul.find(">li").slice(1).toggleClass("marge");
		});
	});
});

