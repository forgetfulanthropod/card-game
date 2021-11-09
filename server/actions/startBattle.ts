
import type { StartBattle } from '@shared'

import { resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'


export const startBattle: StartBattle = async (_args) => {
    const scene = getBattleScene('alice')
    if (scene.get('state') === 'in battle') {
        // already in game
        logger.warn('already started game')
        return
    }
    scene.set('state', 'in battle')
    await resetRound(scene)
}
