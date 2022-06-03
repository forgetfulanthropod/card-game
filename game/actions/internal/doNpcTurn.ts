import type { NextAction } from 'shared'

import { maybeTransitionBattleState, interpretCommand } from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_BETWEEN_NPC_MOVES = 1000

export function doNpcTurn(
    game: Gamecursor,
    args: { index: number }
): undefined | NextAction {
    const scene = getBattleSceneIn(game)
    const isBattleOver = maybeTransitionBattleState(scene)
    if (isBattleOver) return undefined
    const processedCmds = scene.get('nextNpcCommands')
    const processedCmd = processedCmds[args.index]
    if (processedCmd == null) return undefined // safety check
    const { targetUids, command, outcome: _outcome } = processedCmd
    if (scene.get('allCharacters', command.characterUid, 'health') ?? 0 > 0) {
        interpretCommand({ command, targetUids, scene })
    }

    if (args.index >= processedCmds.length - 1) {
        return {
            args: {},
            delay: TIME_BETWEEN_NPC_MOVES,
            type: 'endNpcTurn',
        }
    }
    return {
        args: { index: args.index + 1 },
        delay: TIME_BETWEEN_NPC_MOVES,
        type: 'doNpcTurn',
    }
}
