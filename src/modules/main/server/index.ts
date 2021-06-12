import { RpgServer, RpgModule } from '@rpgjs/server'
import { player } from './player'
import { TownMap } from './maps/town'

import { Hero } from './database/actors/hero'
import { Student } from './database/classes/student'
import { Curiosity } from './database/skills/curiosity'

import { Key } from './database/items/key';
import { Manuscript1, Manuscript2, Manuscript3 } from './database/items/manuscripts';
import { ReadymadeMalheureux, Compass, Abacus } from './database/items/maths'
import { ErlenmeyerFlask, PetriDish, Amperemeter } from './database/items/experimental-sciences'
import { Timeline, WorldMap, BilingualDictionary } from './database/items/human-sciences'
import { Talisman, MagicEraser, Heartsnatcher, TemporalDistorsor, Loudspeaker } from './database/items/bonus'

@RpgModule<RpgServer>({ 
    player,
    database: {
        Hero, Student, Curiosity,
        Key,
        Manuscript1, Manuscript2, Manuscript3,
        ReadymadeMalheureux, Compass, Abacus,
        ErlenmeyerFlask, PetriDish, Amperemeter,
        Timeline, WorldMap, BilingualDictionary,
        Talisman, MagicEraser, Heartsnatcher, TemporalDistorsor, Loudspeaker,
    },
    maps: [
        TownMap
    ]
})
export default class RpgServerEngine {}
