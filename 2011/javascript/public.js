jQuery(document).ready(function() {

	/*
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
//	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("#page").toggleClass("gs");
	});

	/*
	* Changement de couleurs lors du hover
	*/
/*	$(".item").hover(
		function(){
			$(this).addClass("over");
			if ($(this).is("dd")) {
				$(this).prev("dt").addClass("over");
			}
		}
		,
		function(){
			$(this).removeClass("over");
			if ($(this).is("dd")) {
				$(this).prev("dt").removeClass("over");
			}
		}
	);
*/
	/*
	* jquery UI Tabs
	*/
	$("#accordeon").accordion({
		autoHeight: false
	});

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

