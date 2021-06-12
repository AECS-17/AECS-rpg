// This file is released under the MIT License. See the LICENSE file.

import { Class } from '@rpgjs/database'
import { Curiosity } from '../skills/curiosity'

@Class({
    name: 'Étudiant',
    equippable: [],
    skillsToLearn: [
        { level: 1, skill: Curiosity }
    ]
})
export class Student {}
