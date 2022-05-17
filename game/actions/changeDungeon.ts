import type { ServerActions } from '@serverActions'

import { getRulebook } from '@/rulebook'
import { getEntryScene } from '@/util'

export const changeDungeon: ServerActions['ChangeDungeon'] = args => {
    const levels = getRulebook().dungeonLevels
    const scene = getEntryScene(args.username)

    let l = scene.select('selectedLevel').get().num + args.direction

    if (l < 1) {
        l = levels.length
    } else if (l > levels.length) {
        l = 1
    }

    scene.select('selectedCharacters').set([])
    scene.select('selectedLevel').set(levels[l - 1])
}
