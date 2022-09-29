import type { InternalActions } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    popAndRunQueue,
    updateNpcMoves,
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

    clearBlock(scene, 'pc')

    drawNewHand(scene)
    popAndRunQueue(scene, 'pc')

    scene.set('damagesDealtThisTurn', [])
}
