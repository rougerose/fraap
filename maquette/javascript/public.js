jQuery(document).ready(function() {

	/*
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
//	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#page").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("#page").toggleClass("gs");
	});

	/*
	* Changement de couleurs lors du hover
	*/
	$(".item").hover(
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

	/*
	* Animation du formulaire Recherche
	*/
	$("#recherche").each(function(){
		var $recherche = $(this),
			$slide = $recherche.find("form"),
			$ul = $recherche.next("ul");
			compteur = 0;
		$ul.prepend('<li class="bouton recherche filets"><a href="#">recherche</a></li>');
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

