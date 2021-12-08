import type { StartBattle } from '@serverActions'

import { resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'

export const startBattle: StartBattle = async args => {
    const scene = getBattleScene(args.username)
    if (scene.get('state') === 'in battle') {
        // already in game
        logger.warn('already started game')
        return
    }
    scene.set('state', 'in battle')
    await resetRound(scene, args.username)
}
