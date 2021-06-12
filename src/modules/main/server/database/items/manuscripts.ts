// This file is released under the MIT License. See the LICENSE file.

import { Item } from '@rpgjs/database'

@Item({
    name: 'Manuscrit 1',
    description: `Un manuscrit sur lequel est écrit "... ou qui ... nrubannée ... une troupe de p... es aperçus sur la rou... re du bois ... Il y a enfin, quand on a ... uelqu'un qui vous chasse ..."`,
    consumable: false,
})
export class Manuscript1 { }

@Item({
    name: 'Manuscrit 2',
    description: `Un manuscrit sur lequel est écrit "III ... l y a un oiseau, son chant vous ... fait rougir ... horloge qui ne sonne pas ... drière avec un nid de ... rale qui descend et un ... ture abandonnée ... cend le sentier ... etits comédiens ... à travers ... aim et soif..."`,
    consumable: false,
})
export class Manuscript2 { }

@Item({
    name: 'Manuscrit 3',
    description: `Un manuscrit sur lequel est écrit "Au bois ... arrête et vou... Il y a une ... Il y a une f... bêtes blanches. Il y a une cathé ... lac qui monte ... Il y a une peti ... dans le taillis ... en courant, ... Il y a ... en costum ... la lisi ..."`,
    consumable: false,
})
export class Manuscript3 { }
