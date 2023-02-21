import type { InternalActions } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    popAndRunQueue,
    updateNpcMoves,
    decrementEffects,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { checkServerScoringEvent } from '@/gameState/battle/score/checkServerScoringEvent'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export const endNpcTurn: InternalActions['endNpcTurn'] = ({ game }): void => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) logger.info('ending NPC turn')

    scene.apply('turnCount', c => c + 1)
    setRoundEnergy(scene)
    clearHasMoved(scene)

    scene.set('isPlayerTurn', true)

    clearBlock(scene, 'pc')

    popAndRunQueue(scene, 'pc')

    drawNewHand(scene)
    decrementEffects(scene, 'npc')

    checkServerScoringEvent('HIT_VULGAR_THRESHOLD', scene)
    checkServerScoringEvent('BLOCK_OVER_THRESHOLD', scene)

    scene.set('damagesDealtThisTurn', [])
    scene.set('blocksAppliedThisTurn', [])

    updateNpcMoves(scene)
}
