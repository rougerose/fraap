# Dev

## WIP
- Conversion .media-box -> .media
- Ajout data-page des rubriques
- Ajouter le sous-titre des articles dans les résumés

## Observatoire
Design à définir. 2 possibilités : ou bien présentation des sous-rubriques à la manière de Organisation > Plaidoyer ; ou bien une liste des articles comme pour CP, Mobilisations...

## Index des mots-clés
- fusionner certains groupes en thèmes (cp, mobilisations, élections) ?

## Squelettes de Rubrique
- supprimer la marge gauche liée à l'icône de la rubrique
- adapter la couleur de l'icône, notamment fiches pratique avec la couleur principale à 500

## Accordéon
- harmoniser les styles avec details + summary

## Annuaire
- focus sur un point dans la carte : augmenter la valeur du zoom.

## Contenus Spip
- schema json+ld

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
- le focus est visible et les styles sont à corriger

## A vérifier
- usage de scroll-behavior dans la carte
- modale ouverte : ESC ne referme pas la modale


## accessibilité
- label sur les logos rubriques et articles
- aria-label : nav cf. <https://www.aditus.io/patterns/multiple-navigation-landmarks/>
