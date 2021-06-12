// This file is released under the MIT License. See the LICENSE file.

import { Item } from '@rpgjs/database'

@Item({
    name: 'Readymade malheureux',
    description: `Un précis de géométrie abîmé par les intempéries.`,
    consumable: false,
})
export class ReadymadeMalheureux { }

@Item({
    name: 'Compas',
    description: `Un instrument de géométrie pour tracer des arcs de cercle et comparer des distances.`,
    consumable: false,
})
export class Compass { }

@Item({
    name: 'Abaque',
    description: `Un instrument mécanique d'assistance calculatoire.`,
    consumable: false,
})
export class Abacus { }
