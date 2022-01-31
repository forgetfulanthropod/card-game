import type { StartBattle } from '@serverActions'

import { resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'

export const startBattle: StartBattle = args => {
    const scene = getBattleScene(args.username)

    // if (scene.get('state') === 'in battle') {
    //     // already in game
    //     logger.warn('already started game')

    //     return
    // }
    // scene.set('state', 'in battle')
    resetRound(scene)
}
