import type { ChangeDungeon } from '@shared'

import { rulebook } from '@/rulebook'
import { getEntryScene } from '@/util'
export const changeDungeon: ChangeDungeon = (args) => {
    const levels = rulebook.dungeonLevels
    const scene = getEntryScene('alice')

    let l = (scene.select('selectedLevel').get()).num + args.direction

    if (l < 1) {
        l = levels.length
    } else if (l > levels.length) {
        l = 1
    }

    scene.select('selectedCharacters').set([])
    scene.select('selectedLevel').set(levels[l - 1])
    scene.commit()
}
