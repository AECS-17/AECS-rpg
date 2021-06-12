// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer, Move } from '@rpgjs/server'
import { Talisman } from '../database/items/bonus'

export function EnemyEvent(options: {
    name: string,
    graphic: string,
    moveRandom?: boolean,
    frequency?: number,
    speed?: number
}): object {
    @EventData({
        name: options.name,
        hitbox: {
            width: 32,
            height: 16
        }
    })
    class EnemyEvent extends RpgEvent {
        onInit() {
            this.speed = options.speed || 3
            this.frequency = options.frequency || 200
            this.setGraphic(options.graphic)
            if (options.moveRandom) this.infiniteMoveRoute([ Move.tileRandom() ])
        }

        async onPlayerTouch(player: RpgPlayer) {
            if (player instanceof RpgEvent)
                return;
            if (player.hp == 0)
                return;
            let collisionTime = player.getVariable("HIT");
            if (collisionTime && (Date.now() - collisionTime) / 1000 < 1)
                return;
            Move.turnTowardPlayer(player);
            await player.showText(`¿¿ 😡 !!!`, { talkWith: this });
            if (!player.hasItem(Talisman))
                player.hp = 0;
            else
                player.hp--;
            player.setVariable("HIT", Date.now());
            Move.tileAwayFromPlayer(player);
        }
    }
    return EnemyEvent
}
