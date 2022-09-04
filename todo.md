# Dev

## WIP
- Conversion .section -> .pod
- Ajout data-page des rubriques
- Ajouter le sous-titre des articles dans les résumés

## Fiches pratiques
- moteur de recherche

## Page Mot-clé
- Différencier articles, fiches pratiques, Médiathèque, et ??
- référence : https://www.monde-diplomatique.fr/index/pays/royaumeuni#pagination_livres

## Squelettes de Rubrique
- supprimer la marge gauche liée à l'icône de la rubrique
- adapter la couleur de l'icône, notamment fiches pratique avec la couleur principale à 500

## Accordéon
- harmoniser les styles avec details + summary

## Annuaire
- focus sur un point dans la carte : augmenter la valeur du zoom.

## Contenus Spip
- supprimer les surtitres (cf. liste de 19 articles à modifier avant).
- Rubriques : descriptif pour les résumés, texte pour la page proprement dite.
- schema json+ld
- liens internes dans le texte en noir.
- ~~adapter le sommaire automatique aux niveaux des intertitres~~


## Plugins Spip
- conserver les champs extras (plugin principal + interface) tant que la modification des données annuaires (site, auteur) n'est pas complète.

## JS
- utiliser les modules ?


# Bugs

## Safari 11.1.2
- erreurs JS, soulignement intertitres...
- menu principal et recherche
- flexbox gap
- grid gap (grid-gap)
- section réseau invisible => prévoir une alternative à IntersectionObserver pour ces versions incompatibles

## Firefox mobile
- ~~le header s'agrandit à l'ouverture de la fenêtre offcanvas~~
- le focus est visible et les styles sont à corriger

## A vérifier
- usage de scroll-behavior dans la carte
- modale ouverte : ESC ne referme pas la modale


## accessibilité
- label sur les logos rubriques et articles
- aria-label : nav cf. <https://www.aditus.io/patterns/multiple-navigation-landmarks/>
