import type { BattleScene, Card, CharacterUid, NextAction } from 'shared'

import { checkBattleOverMut, play } from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_BETWEEN_NPC_MOVES = 1000

export function doNpcTurn(
    game: Gamecursor,
    args: { index: number }
): undefined | NextAction {
    const scene = getBattleSceneIn(game)
    const isBattleOver = checkBattleOverMut(scene)
    if (isBattleOver) return undefined
    const nextCards = scene.get('nextEnemyCards')
    const card = nextCards[args.index]
    if (card == null) return undefined // safety check
    const targetUids = determinePcTargets(scene.get(), card)
    play({ card, targetUids, scene })
    if (args.index >= nextCards.length - 1) {
        return {
            args: {},
            delay: TIME_BETWEEN_NPC_MOVES,
            type: 'resetRound',
        }
    }
    return {
        args: { index: args.index + 1 },
        delay: TIME_BETWEEN_NPC_MOVES,
        type: 'doNpcTurn',
    }
}

/** TODO */
function determinePcTargets(scene: BattleScene, card: Card): CharacterUid[] {
    return []
}
