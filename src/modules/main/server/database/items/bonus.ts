// This file is released under the MIT License. See the LICENSE file.

import { Item } from '@rpgjs/database'

@Item({
    name: 'Talisman de Paix',
    description: 'Un pendentif anti-violence.',
    consumable: false
})
export class Talisman { }

@Item({
    name: 'Arrache-cœur',
    description: 'Objet suréaliste pour récupèrer le souffle de vie de sa victime.',
    consumable: false
})
export class Heartsnatcher { }

@Item({
    name: 'Haut-Parleur',
    description: 'Amplificateur vocal pour apporter plus de percussion à ses propos.',
    consumable: false
})
export class Loudspeaker { }

@Item({
    name: 'Distorseur Temporel',
    description: 'Curiosité quantique pour ralentir le temps.',
    consumable: false
})
export class TemporalDistorsor { }

@Item({
    name: 'Gomme Magique',
    description: 'Morceau de caoutchouc pour effacer une mauvaise réponse.',
    consumable: false
})
export class MagicEraser { }
