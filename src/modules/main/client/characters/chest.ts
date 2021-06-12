// This file is released under the MIT License. See the LICENSE file.

import { Spritesheet, Animation, Direction, RpgSprite } from '@rpgjs/client'

@Spritesheet({
    id: 'chest',
    image: require('./assets/chest.png'),
    width: 124,
    height: 61,
    framesHeight: 2,
    framesWidth: 4,
    textures: {
        [Animation.Stand]: {
            animations: direction => [[ {time: 0, frameX: 1, frameY: direction == Direction.Up ? 0 : 1 } ]]
        }
    }
})
export class Chest  { }
