<?php

// restreindre l'affichage champs extra sur les articles de l'annuaire (rubrique 3)
// voir http://www.spip-contrib.net/Champs-Extras-2
include_spip('inc/cextras_autoriser');
restreindre_extras('article', array('site', 'contact'), 3);



/**
* Convert a hexa decimal color code to its RGB equivalent
*
* @param string $hexStr (hexadecimal color value)
* @param boolean $returnAsString (if set true, returns the value separated by the separator character. Otherwise returns associative array)
* @param string $seperator (to separate RGB values. Applicable only if second parameter is true.)
* @return array or string (depending on second parameter. Returns False if invalid hex color value)
*/
//http://www.php.net/manual/en/function.hexdec.php#99478

function hex2rgb($hexStr, $returnAsString = true, $seperator = ',') {
	$hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr); // Gets a proper hex string
	$rgbArray = array();
	if (strlen($hexStr) == 6) { //If a proper hex code, convert using bitwise operation. No overhead... faster
		$colorVal = hexdec($hexStr);
		$rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
		$rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
		$rgbArray['blue'] = 0xFF & $colorVal;
	} elseif (strlen($hexStr) == 3) { //if shorthand notation, need some string manipulations
		$rgbArray['red'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
		$rgbArray['green'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
		$rgbArray['blue'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
	} else {
		return false; //Invalid hex color code
	}
	return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray; // returns the rgb string or the associative array
}

/**
 * comparaison d'une date par rapport à celle du jour
 * usage : [(#DATE|date_comparaison{365}|?{oui,non})]
 */

function date_comparaison($date,$jours) {
    $datetime1 = new DateTime($date);
    $datetime2 = new DateTime('now');
    $interval = $datetime1->diff($datetime2);
    $nbre = $interval->format('%a');
    if ($nbre >= $jours) {
        return true;
    } else {
        return false;
    }
}

?>