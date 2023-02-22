import type { GameActions } from 'shared'

import {
    applyTurnStartEffects,
    clearBlock,
    endRound,
    popAndRunQueue,
} from '@/gameState'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { clearCharacterStatModifiers } from '@/gameState/battle/characters/clearCharacterStatModifiers'
import { checkServerScoringEvent } from '@/gameState/battle/score'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'

const TIME_AFTER_PLAYER_MOVE = 1000

export const endTurn: GameActions['endTurn'] = args => {
    const scene = getBattleSceneIn(args.game)
    trackMetric('endTurn', { scene })

    checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
    checkServerScoringEvent('CARDS_WHOLE_PARTY', scene)

    endRound(scene)
    clearBlock(scene, 'npc')

    applyTurnStartEffects(scene, 'npc')

    clearCharacterStatModifiers(scene, 'turn')

    activateSouvenirs('turnEnd', scene)

    popAndRunQueue(scene, 'npc')

    args.game.set('nextAction', {
        index: 0,
        method: 'doNpcTurn',
        delay: TIME_AFTER_PLAYER_MOVE,
    })
}
