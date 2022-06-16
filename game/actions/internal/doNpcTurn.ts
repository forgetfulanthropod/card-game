import type { BattleScene, Command, InternalActions } from 'shared'

import {
    maybeTransitionBattleState,
    interpretCommand,
    isAlive,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_BETWEEN_NPC_MOVES = 1000

export const doNpcTurn: InternalActions['doNpcTurn'] = ({ game, index }) => {
    const scene = getBattleSceneIn(game)
    const isBattleOver = maybeTransitionBattleState(scene)
    if (isBattleOver) return
    const processedCmds = scene.get('nextNpcCommands')
    const processedCmd = processedCmds[index]

    const { targetUids, command } = processedCmd
    if (validateCommand(scene.get(), command)) {
        interpretCommand({ command, targetUids, scene })
    }

    if (index >= processedCmds.length - 1) {
        game.set('nextAction', {
            delay: TIME_BETWEEN_NPC_MOVES,
            method: 'endNpcTurn',
        })
        return
    }
    game.set('nextAction', {
        index: index + 1,
        delay: TIME_BETWEEN_NPC_MOVES,
        method: 'doNpcTurn',
    })
}

function validateCommand(scene: BattleScene, command: Command): boolean {
    return command != null && isAlive(scene, command.characterUid)
}
