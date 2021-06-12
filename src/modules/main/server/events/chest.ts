// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, EventMode, Direction } from '@rpgjs/server'
import { Key } from '../database/items/key';

export function ChestEvent(options): object {

    const { name, gain, locked } = options

    @EventData({
        name,
        mode: EventMode.Scenario,
        hitbox: {
            width: 32,
            height: 16
        }
    })
    class ChestEventClass extends RpgEvent {
        onInit() {
            this.changeDirection(Direction.Up)
            this.setGraphic('chest')
        }
        async onAction(player: RpgPlayer) {
            if (player.getVariable(name)) {
                return
            }
            if (player.getDirection() != Direction.Up) {
                return
            }
            if (locked && !player.hasItem(Key)) {
               await player.showText("Ce coffre est fermé à clé...");
               return;
            }
            player.addItem(gain)
            player.showText(`Reçu: ${gain.prototype['name']}.`);
            this.changeDirection(Direction.Down)
            player.setVariable(name, true)
        }
    }
    return ChestEventClass
}
