// This file is released under the MIT License. See the LICENSE file.

import { Spritesheet, Presets } from '@rpgjs/client'

const { RMSpritesheet } = Presets

@Spritesheet({
    images: {
        sphinge: require('./assets/sphinge.png'),
        enemy3_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Enemy/Enemy 03-1.png'),
        enemy7_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Enemy/Enemy 07-1.png'),
        enemy11_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Enemy/Enemy 11-1.png'),
        enemy13_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Enemy/Enemy 13-1.png'),
        cat1_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Animal/Cat 01-1.png'),
        cat1_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Animal/Cat 01-3.png'),
        dog1_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Animal/Dog 01-2.png'),
        female1_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 01-1.png'),
        female1_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 01-2.png'),
        female1_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 01-3.png'),
        female1_4: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 01-4.png'),
        female22_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 22-2.png'),
        female2_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 02-2.png'),
        female5_4: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 05-4.png'),
        female10_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 10-2.png'),
        female13_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 13-2.png'),
        female19_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Female/Female 19-3.png'),
        male1_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 01-1.png'),
        male1_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 01-2.png'),
        male1_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 01-3.png'),
        male1_4: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 01-4.png'),
        male4_1: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 04-1.png'),
        male7_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 07-3.png'),
        male12_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 12-2.png'),
        male13_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 13-2.png'),
        male16_3: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 16-3.png'),
        male17_2: require('../../../../pipoya/PIPOYA FREE RPG Character Sprites 32x32/Male/Male 17-2.png'),
    },
    width: 96,
    height: 128,
    ...RMSpritesheet(3, 4)
})
export class Characters { }
