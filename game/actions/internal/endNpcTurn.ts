import type { InternalActions } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    decrementEffects,
    applyTurnStartEffects,
    popAndRunQueue,
    setNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export const endNpcTurn: InternalActions['endNpcTurn'] = ({ game }): void => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) logger.info('ending NPC turn')
    setNpcMoves(scene)

    setRoundEnergy(scene)
    clearHasMoved(scene)

    decrementEffects(scene, 'npc')
    scene.set('isPlayerTurn', true)
    clearBlock(scene, 'pc')
    applyTurnStartEffects(scene, 'pc')
    drawNewHand(scene)
    popAndRunQueue(scene, 'pc')
}
