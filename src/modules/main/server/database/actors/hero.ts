// This file is released under the MIT License. See the LICENSE file.

import { Actor } from '@rpgjs/database'
import { Presets } from '@rpgjs/server'
import { Student } from '../classes/student'

const { MAXHP, MAXSP, MAXHP_CURVE, MAXSP_CURVE } = Presets

@Actor({
    name: 'Héros',
    initialLevel: 1,
    finalLevel: 5,
    expCurve: {
        basis: 30,
        extra: 20,
        accelerationA: 30,
        accelerationB: 30
    },
    parameters: {
        [MAXHP]: { start: 10, end: 10 },
        [MAXSP]: MAXSP_CURVE
    },
    startingEquipment: [],
    class: Student
})
export class Hero {
}
