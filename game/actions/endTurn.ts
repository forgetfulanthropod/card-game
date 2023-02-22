import type { GameActions } from 'shared'

import { trackMetric } from 'server/metrics'
import { getBattleSceneIn } from '@/util'
import {
    applyTurnStartEffects,
    clearBlock,
    decrementEffects,
    popAndRunQueue,
    endRound,
} from '@/gameState'
import { clearCharacterStatModifiers } from '@/gameState/battle/characters/clearCharacterStatModifiers'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { checkServerScoringEvent } from '@/gameState/battle/score'

const TIME_AFTER_PLAYER_MOVE = 1000

export const endTurn: GameActions['endTurn'] = args => {
    const scene = getBattleSceneIn(args.game)
    trackMetric('endTurn', { scene })

    checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
    checkServerScoringEvent('CARDS_WHOLE_PARTY', scene)

    endRound(scene)
    clearBlock(scene, 'npc')

    applyTurnStartEffects(scene, 'pc')
    applyTurnStartEffects(scene, 'npc')

    decrementEffects(scene, 'pc')

    clearCharacterStatModifiers(scene, 'turn')

    activateSouvenirs('turnEnd', scene)

    popAndRunQueue(scene, 'npc')

    args.game.set('nextAction', {
        index: 0,
        method: 'doNpcTurn',
        delay: TIME_AFTER_PLAYER_MOVE,
    })
}
