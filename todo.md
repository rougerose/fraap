# Dev

## WIP
- Conversion .section -> .pod
- Ajout data-page des rubriques
- Ajouter le sous-titre des articles dans les résumés

## Toutes les rubriques
- ajouter TEXTE et DESCRIPTIF (site dev)

## Médiathèque
- rubrique médiathèque, régler la pagination : position de l'ancre et url perso
- rubrique médiathèque : mots-clés chaque ressource : ajouter lien pour ajouter le critère de filtre

## Observatoire
Design à définir. 2 possibilités : ou bien présentation des sous-rubriques à la manière de Organisation > Plaidoyer ; ou bien une liste des articles comme pour CP, Mobilisations...

## Fiches pratiques
- moteur de recherche ?

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
- supprimer les surtitres (cf. liste de 19 articles à modifier avant).
- Rubriques : descriptif pour les résumés, texte pour la page proprement dite.
- schema json+ld
- liens internes dans le texte en noir.


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
- le focus est visible et les styles sont à corriger

## A vérifier
- usage de scroll-behavior dans la carte
- modale ouverte : ESC ne referme pas la modale


## accessibilité
- label sur les logos rubriques et articles
- aria-label : nav cf. <https://www.aditus.io/patterns/multiple-navigation-landmarks/>
