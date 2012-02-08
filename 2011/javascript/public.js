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
	$("#extra-tabs, #annuaire-contact").tabs();


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
/*		navigationFilter: function() {
			var hash = window.location.hash;
			var dt = $('a[href='+hash+']').parent('dt');
			console.log(dt); //return dt;
		},
*/		// on se met doucement là où il faut http://stackoverflow.com/a/3621845
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
	* Animation du formulaire Recherche
	*/
	$("#formulaire_recherche").each(function(){
		var $recherche = $(this),
			$slide = $recherche.find("form").hide(),
			$ul = $recherche.next("ul").addClass("ok");
			compteur = 0;
		$ul.prepend('<li class="recherche filets"><a href="#">recherche</a></li>');
		var $bouton = $ul.find(".recherche");

	//	$slide.hide();

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

