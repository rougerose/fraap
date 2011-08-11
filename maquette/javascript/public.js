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
});

