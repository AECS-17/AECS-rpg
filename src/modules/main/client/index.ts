import { RpgClient, RpgModule } from '@rpgjs/client'

import { TownTilesets } from './maps/town'
import { Characters } from './characters/characters'
import { Chest } from './characters/chest'
import controls from './gui/controls.vue'
import gameover from './gui/gameover.vue'
import items from './gui/items.vue'

@RpgModule<RpgClient>({ 
    spritesheets: [
        TownTilesets,
        Characters,
        Chest,
    ],
    gui: [controls, gameover, items],
})
export default class RpgClientEngine {}
