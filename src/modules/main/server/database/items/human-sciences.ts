// This file is released under the MIT License. See the LICENSE file.

import { Item } from '@rpgjs/database'

@Item({
    name: 'Mappemonde',
    description: `Une carte représentant toutes les parties du globe terrestre divisé en deux hémisphères.`,
    consumable: false,
})
export class WorldMap { }

@Item({
    name: 'Frise Chronologique',
    description: `Une représentation linéaire d'évènements historiques positionnés sur la flèche du temps.`,
    consumable: false,
})
export class Timeline { }

@Item({
    name: 'Dictionnaire bilingue',
    description: ` Un ouvrage indiquant les équivalences des mots et/ou expressions entre deux langues différentes.`,
    consumable: false,
})
export class BilingualDictionary { }
