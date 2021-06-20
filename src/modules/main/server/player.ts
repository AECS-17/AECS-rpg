// This file is released under the MIT License. See the LICENSE file.

import { RpgPlayer, RpgPlayerHooks, RpgMap, Control } from '@rpgjs/server'
import { Hero } from './database/actors/hero'

export const player: RpgPlayerHooks = {
    async onConnected(player: RpgPlayer) {
        player.setActor(Hero);
        player.setHitbox(20, 16)
        const characters = [
          'female1_1',
          'female1_2',
          'female1_3',
          'female1_4',
          'female3_1',
          'female3_2',
          'female3_3',
          'female3_4',
          'female11_1',
          'female11_2',
          'female11_3',
          'female11_4',
          'male1_1',
          'male1_2',
          'male1_3',
          'male1_4',
          'male2_1',
          'male2_2',
          'male2_3',
          'male2_4',
          'male3_1',
          'male3_2',
          'male3_3',
          'male3_4',
        ];
        const characterIndex = (new Date()).getTime() % characters.length;
        player.setGraphic(characters[characterIndex]);
        player.name = `ANONYME${(new Date()).getTime() % 10000}`;
        player.level = 5;
        player.hp = 10;
        await player.changeMap('town')
    },

    async onInput(player: RpgPlayer, data: { input: any }) {
        if (player.hp <= 0) {
            player.gui('gameover').open();
            return;
        }
        if (data.input == Control.Back)
            player.gui('items').open();
    },

    async onJoinMap(player: RpgPlayer, map: RpgMap) {
        await player.showText(`« L'Attaque de l'Énigmatique et Carnivore Sphinge »`,
                              { fullWidth: true,
                                typewriterEffect: false });
        player.gui('controls').open();
    },

    // This is not enabled by default. So display gameover in onInput instead.
    // https://docs.rpgjs.dev/api/RpgPlayerHooks.html#ondead
    onDead(player: RpgPlayer) {
        player.gui('gameover').open();
    },
}
