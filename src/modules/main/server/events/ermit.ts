// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, Move } from '@rpgjs/server'
import { Key } from '../database/items/key';

import { pickRandomQuestion } from '../questions';

@EventData({
    name: 'EV-ERMIT',
    hitbox: {
        width: 32,
        height: 16
    },
})
export class ErmitEvent extends RpgEvent {
    onInit() {
        this.setGraphic('male13_2')
    }
    async onAction(player: RpgPlayer) {
        if (!player.hasItem(Key)) {
           await player.showText("Répond correctement à dix questions et je te donne ma clé...", { talkWith: this });
           for (var i = 0; i < 10; i++) {
               const level = 1;
               let question = pickRandomQuestion(level);
               const choice = await player.showChoices(
                   question.statement, question.options, { talkWith: this });
               if (!choice || !choice.value) {
                  await player.showText("Désolé, mauvaise réponse...", { talkWith: this });
                  return;
               }
           }

           await player.showText("Bravo, voilà pour toi !", { talkWith: this });
           player.addItem(Key);
           await player.showText("Reçu : Clé.", { talkWith: this });
           return;
        }

        await player.showText("Répète deux fois « Gargouille, Chevalier, Ange »", { talkWith: this });
    }
}
