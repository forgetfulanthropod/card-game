import type { BattleCursor, GameActions } from 'shared'

import { applyTurnStartEffects, clearBlock, popAndRunQueue } from '@/gameState'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { discardAllCards } from '@/gameState/battle/cards/discardAllCards'
import { clearCharacterStatModifiers } from '@/gameState/battle/characters/clearCharacterStatModifiers'
import { setAllCharactersToUnmoved } from '@/gameState/battle/characters/setAllCharactersToUnmoved'
import { trackStanceChanges } from '@/gameState/battle/characters/trackStanceChanges'
import { checkServerScoringEvent } from '@/gameState/battle/score'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'

const TIME_AFTER_PLAYER_MOVE = 1000

export const endTurn: GameActions['endTurn'] = args => {
    const scene = getBattleSceneIn(args.game)

    if (
        scene.get('isPlayerTurn') !== true ||
        scene.get('state') !== 'in battle' ||
        scene.get('isInMap') === true
    ) {
        logger.warn(
            `${scene.get('username')} tried to end turn when not allowed`
        )
        return
    }

    updateMetricsAndScoring(scene)

    setDefaultEndPlayerTurnState(scene)

    applyTurnStartEffects(scene, 'npc')

    activateSouvenirs('turnEnd', scene)

    trackStateChanges(scene)

    popAndRunQueue(scene, 'npc')

    args.game.set('nextAction', {
        index: 0,
        method: 'doNpcTurn',
        delay: TIME_AFTER_PLAYER_MOVE,
    })
}

function updateMetricsAndScoring(scene: BattleCursor) {
    trackMetric('endTurn', { scene })

    checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
    checkServerScoringEvent('CARDS_WHOLE_PARTY', scene)
}

function setDefaultEndPlayerTurnState(scene: BattleCursor) {
    clearBlock(scene, 'npc')

    scene.set('cardsPlayedThisTurn', [])
    scene.set('numAllowedToKeep', 0)
    setAllCharactersToUnmoved(scene)
    discardAllCards(scene)

    scene.set('isPlayerTurn', false)
}

function trackStateChanges(scene: BattleCursor) {
    trackStanceChanges(scene)
}
