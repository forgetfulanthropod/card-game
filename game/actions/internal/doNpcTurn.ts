import type { NextAction } from 'shared'

import { checkBattleOverMut, handleMove } from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_BETWEEN_NPC_MOVES = 1000

export function doNpcTurn(
    game: Gamecursor,
    args: { index: number }
): undefined | NextAction {
    const scene = getBattleSceneIn(game)
    const isBattleOver = checkBattleOverMut(scene)
    if (isBattleOver) return undefined
    const nextMoves = scene.get('nextNpcMoves')
    const move = nextMoves[args.index]
    if (move == null) return undefined // safety check
    handleMove({ scene, attackData: move })

    if (args.index >= nextMoves.length - 1) {
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

// doNpcTurn -> makeMove -> doMove -> shouldGoAgain() ?-> A -> B -> C ...
// getMoves
// |  |  |
// do do do
