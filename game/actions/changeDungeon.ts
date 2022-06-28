import type { GameActions } from 'shared'

import { getRulebook } from '@/rulebook'
import { getEntrySceneIn } from '@/util'

export const changeDungeon: GameActions['changeDungeon'] = args => {
    const levels = getRulebook().dungeonLevels
    const scene = getEntrySceneIn(args.game)

    let l = scene.select('selectedLevel').get().num + args.direction

    if (l < 1) {
        l = levels.length
    } else if (l > levels.length) {
        l = 1
    }

    scene.select('selectedCharacters').set([null, null, null])
    scene.select('selectedLevel').set(levels[l - 1])
}
