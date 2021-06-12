// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, Move } from '@rpgjs/server'
import { Key } from '../database/items/key';

import { pickRandomQuestion, pickRandomCourse } from '../questions'

@EventData({
    name: 'EV-VILLAGER-SVT',
    hitbox: {
        width: 32,
        height: 16
    },
})
export class ApothecaryEvent extends RpgEvent {
    onInit() {
        this.setGraphic('male4_1')
    }
    async onAction(player: RpgPlayer) {
        if (player.hp > 1) {
            let text = pickRandomCourse(player.level, "svt") || ["Depuis que la sphinge est apparue, je n'ai plus aucun client !"];
            for (let msg of text) {
                await player.showText(msg, {
                    talkWith: this
                })
            }
            return;
        }

        await player.showText(`Tu n'as pas l'air d'être en grande forme.`, { talkWith: this });
        await player.showText("Je peux te guérir si tu réponds correctement à mes questions.", { talkWith: this });
        for (var i = 0; i < 9; i++) {
            let question = pickRandomQuestion(player.level);
            const choice = await player.showChoices(
                question.statement, question.options, { talkWith: this });
            if (choice && choice.value)
                player.hp++;
        }

        await player.showText("Reviens me voir si tu veux des médicaments !", { talkWith: this });
    }
}
