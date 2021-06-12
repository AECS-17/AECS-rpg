// This file is released under the MIT License. See the LICENSE file.

import { Item } from '@rpgjs/database'

@Item({
    name: 'Erlenmeyer',
    description: `Une fiole conique de 500 mL.`,
    consumable: false,
})
export class ErlenmeyerFlask { }

@Item({
    name: 'Boîte de Pétri',
    description: `Une boîte cylindrique peu profonde en verre, munie d'un couvercle.`,
    consumable: false,
})
export class PetriDish { }

@Item({
    name: 'Ampèremètre',
    description: `Un appareil de mesure de l'intensité d'un courant électrique dans un circuit.`,
    consumable: false,
})
export class Amperemeter { }
