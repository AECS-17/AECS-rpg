// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, Direction } from '@rpgjs/server'

export function StatueEvent(options): object {

    const { name, code, gain, value, text } = options

    @EventData({
        name,
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class StatueEvent extends RpgEvent {
        async onAction(player: RpgPlayer) {
            if (player.getDirection() != Direction.Up) {
                return
            }

            let current_code = player.getVariable('STATUE_CODE');
            if (!current_code) {
                player.setVariable('STATUE_CODE', []);
                await player.showText(text);
                return;
            }
            current_code.push(value);
            await player.showText(`${current_code.join(', ')}`);
            if (current_code.length == 6) {
                if (current_code.toString() == code.toString()) {
                    await player.showText('Code correct !');
                    if (!player.getVariable(name)) {
                        player.addItem(gain);
                        player.showText(`Reçu: ${gain.prototype['name']}.`);
                        player.setVariable(name, true);
                    }
                }
               player.changeDirection(Direction.Down)
               player.setVariable('STATUE_CODE', null);
                return;
            }

            player.setVariable('STATUE_CODE', current_code);
        }
    }
    return StatueEvent
}
