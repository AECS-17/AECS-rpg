// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, Move } from '@rpgjs/server'
import { Talisman, Heartsnatcher, Loudspeaker, TemporalDistorsor, MagicEraser } from '../database/items/bonus'

import { pickRandomQuestion } from '../questions'

@EventData({
    name: 'EV-SPHINGE',
    hitbox: {
        width: 32,
        height: 16
    },
})
export class SphingeEvent extends RpgEvent {
    onInit() {
        this.speed = 1;
        this.frequency = 50;
        this.setGraphic('sphinge')
        this.hp = 100;
        this.infiniteMoveRoute([ Move.tileRandom()]);
        this.teleportAtRandomPosition();
    }

    teleportAtRandomPosition() {
        // Workaround for https://github.com/RSamaium/RPG-JS/issues/96
        // this.teleport("EV-SPHINGE");
        let coordinates = new Array(
            { x: 32.7207, y: 65.7793, z: 0 },
            { x: 588.667, y: 692, z: 0 },
            { x: 81.3333, y: 1574, z: 0 },
            { x: 79.3333, y: 860.667, z: 0 },
            { x: 156.667, y: 1882.67, z: 0 },
            { x: 599.758, y: 40.1212, z: 0 },
            { x: 1335.33, y: 315.333, z: 0 },
            { x: 1354, y: 938, z: 0 },
            { x: 434.061, y: 998.848, z: 0 },
            { x: 1682, y: 978.667, z: 0 },
            { x: 1835.33, y: 1807.33, z: 0 },
            { x: 1775.39, y: 352.243, z: 0 },
            { x: 1580.7, y: 530.182, z: 0 },
            { x: 1440.85, y: 1395.64, z: 0 },
        );
        this.teleport(coordinates[Math.floor(Math.random() * coordinates.length)]);
    }

    async onAction(player: RpgPlayer) {
        if (this.hp == 0) {
           await player.showText(`🐱 Ron ron ron...`, { talkWith: this });
           return;
        }

        await player.showText("Tu penses pouvoir répondre à mon énigme ? Vérifions cela...", { talkWith: this });
        let question = pickRandomQuestion(player.level);
        let maxTimeSeconds = player.hasItem(TemporalDistorsor) ? 60 : 30;
        let startTime = (new Date()).getTime();

        let options = question.options;
        if (player.hasItem(MagicEraser)) {
            let index = Math.floor(Math.random() * options.length);
            if (options[index].value)
               index = (index + 1) % options.length;
            options.splice(index, 1);
        }

        const choice = await player.showChoices(
            question.statement, options, { talkWith: this });
        if (choice && choice.value) {
           let duration = Math.floor(((new Date()).getTime() - startTime) / 1000);
           if (duration > maxTimeSeconds) {
               await player.showText(`⌛ Désolé tu es trop lent·e : il t'a fallut ${duration} secondes pour répondre !`, { talkWith: this });
           } else {
               await player.showText("😤 C'est correct...", { talkWith: this });
               let damage = player.hasItem(Loudspeaker) ? 2 * question.damage : question.damage;
               this.hp = Math.max(0, this.hp - damage);
               if (player.hasItem(Heartsnatcher) && player.hp < 10)
                   player.hp++;

               if (this.hp == 0) {
                   await player.showText("Merci tu m'as délivrée du sortilège !", { talkWith: this });
                   await player.showText("Je vais enfin pouvoir reprendre ma forme normale...", { talkWith: this });
                   this.setGraphic('cat1_3');
                   player.setVariable("DONE", true);
                   return;
               }
           }
        } else {
           await player.showText("😈 Mauvaise réponse !", { talkWith: this });
           player.hp--;
        }

        this.teleportAtRandomPosition();
    }

    async onPlayerTouch(player: RpgPlayer) {
        if (player.hp == 0)
            return;
        Move.turnTowardPlayer(player);
       if (this.hp == 0)
           return;
       if (!player.hasItem(Talisman) && player.hp > 0) {
           await player.showText(`😡 Grrrrrrr!!!!`, { talkWith: this });
           player.hp = 0;
       }
    }
}
