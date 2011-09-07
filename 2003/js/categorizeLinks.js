// script : http://www.bobbyvandersluis.com/articles/unobtrusiveshowhide.php

if (document.getElementById && document.getElementsByTagName && document.createElement) {
	document.write('<link rel="stylesheet" type="text/css" href="squelettes/css/js_hideLinks.css" />');
	window.onload = initToggleCategories;
}

function initToggleCategories() {
	// Hide the container with all toggleable elements 
	document.getElementById('Infos').style.display = 'none';
	var as = document.getElementById('Toggle').getElementsByTagName('a');
	for (var i = 0; i < as.length; i++) {
		as[i].onclick = function() {
			toggle(this);
			return false;
		}
	}
}

function toggle(l) {
	// Try to get a reference to an existing container element
	var oldCloneUL = document.getElementById('cloneUL');
	// In case the container element exists, remove it
	if (oldCloneUL) document.getElementById('ConteneurInfos').removeChild(oldCloneUL);
	// Create a new container element
	var cloneUL = document.createElement('ul');
	// Add the id attribute and set its value
	cloneUL.setAttribute('id', 'cloneUL');
	// Append the container to the body element
	document.getElementById('ConteneurInfos').appendChild(cloneUL);
	// Get a reference to all the li elements from the content pool
	var lis = document.getElementById('Infos').getElementsByTagName('li');
	// Retrieve the classname of the category
	var cat_class = l.href.match(/#(\w.+)/)[1];
	// Clone all the li elements from the content pool that have the same category classname assigned and append them to the container element
	for (var i = 0; i < lis.length; i++) {
		if (lis[i].className.indexOf(cat_class) != -1) {
			var clone = lis[i].cloneNode(true);
			cloneUL.appendChild(clone);
		}
	}
}
