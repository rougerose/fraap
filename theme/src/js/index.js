import fraapMenu from "./fraap-menu";
import fraapDialogRecherche from "./fraap-dialog-recherche";
import fraapNetwork from "./fraap-network";
import fraapDialogMembers from "./fraap-dialog-members";

fraapMenu.init();
fraapDialogRecherche.init();
fraapNetwork.init();

// Exporter en variable globale le module fraapDialogMembers
// afin de pouvoir le réinitialiser après un rechargement ajax
export default fraapDialogMembers;
