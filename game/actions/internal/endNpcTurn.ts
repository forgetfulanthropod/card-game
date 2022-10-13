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

// const DEFAULT_WAIT = 1000
const DEBUG = false

export const endNpcTurn: InternalActions['endNpcTurn'] = ({ game }): void => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) logger.info('ending NPC turn')
    updateNpcMoves(scene)

    setRoundEnergy(scene)
    clearHasMoved(scene)

    scene.set('isPlayerTurn', true)

    clearBlock(scene, 'pc')

    drawNewHand(scene)
    popAndRunQueue(scene, 'pc')

    decrementEffects(scene, 'pc')
    decrementEffects(scene, 'npc')

    scene.set('damagesDealtThisTurn', [])
}
