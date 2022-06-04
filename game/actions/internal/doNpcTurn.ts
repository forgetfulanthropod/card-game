import type { BattleScene, Command, NextAction } from 'shared'

import {
    maybeTransitionBattleState,
    interpretCommand,
    isAlive,
} from '@/gameState'
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

    const { targetUids, command, outcome: _outcome } = processedCmd
    if (validateCommand(scene.get(), command)) {
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

function validateCommand(scene: BattleScene, command: Command): boolean {
    return command != null && isAlive(scene, command.characterUid)
}
