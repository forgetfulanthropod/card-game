import type { InternalActions } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    popAndRunQueue,
    updateNpcMoves,
    decrementEffects,
    applyTurnStartEffects,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { checkServerScoringEvent } from '@/gameState/battle/score/checkServerScoringEvent'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { getRoomScoreCounter } from '@/gameState/battle/score'
import { clearCharacterStatModifiers } from '@/gameState/battle/characters/clearCharacterStatModifiers'
import {
    clearCommandHooks,
    clearCommandHooksForTurn,
} from '@/gameState/battle/commandHookUtil'

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
    decrementEffects(scene, 'pc')
    decrementEffects(scene, 'npc')

    activateSouvenirs('turnStart', scene) // buffs/debuffs for calcs
    applyTurnStartEffects(scene, 'pc')

    clearCharacterStatModifiers(scene, 'turn')
    clearCommandHooksForTurn(scene)

    drawNewHand(scene)

    popAndRunQueue(scene, 'pc')

    checkServerScoringEvent('HIT_VULGAR_THRESHOLD', scene)
    checkServerScoringEvent('BLOCK_OVER_THRESHOLD', scene)

    scene.set('scoreEventsThisTurn', getRoomScoreCounter())
    scene.set('damagesUnblockedThisTurn', [])
    scene.set('damagesDealtThisTurn', [])
    scene.set('blocksAppliedThisTurn', [])

    updateNpcMoves(scene)
}
