// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'

export function TextEvent(options: {
    getText: (player: any) => string[],
    name: string,
}): object {
    @EventData({
        name: options.name,
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class TextEvent extends RpgEvent {
        async onAction(player: RpgPlayer) {
            let text = options.getText(player);
            for (let msg of text)
                await player.showText(msg);
        }
    }
    return TextEvent
}
