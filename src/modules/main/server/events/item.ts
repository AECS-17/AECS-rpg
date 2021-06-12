// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, EventMode } from '@rpgjs/server'

export function ItemEvent(options): object {

    const { name, gain } = options

    @EventData({
        name,
        mode: EventMode.Scenario,
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class ItemEventClass extends RpgEvent {
        onInit() {}
        async onAction(player: RpgPlayer) {
            if (player.getVariable(name)) {
                return
            }
            player.addItem(gain)
            player.showText(`Reçu: ${gain.prototype['name']}.`);
            player.setVariable(name, true)
        }
    }
    return ItemEventClass
}
