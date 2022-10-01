import type { BattleScene, Command, Gamecursor, InternalActions } from 'shared'

import {
    maybeTransitionBattleState,
    interpretCommand,
    isAlive,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_BETWEEN_NPC_MOVES = 2000

export const doNpcTurn: InternalActions['doNpcTurn'] = ({ game, index }) => {
    const scene = getBattleSceneIn(game)
    const isBattleOver = maybeTransitionBattleState(scene)

    if (isBattleOver) return
    const processedCmds = scene.get('nextNpcCommands')

    logger.info(JSON.stringify({ processedCmds }))

    // if (processedCmds.length === 0) {
    //     endNpcTurn(game)
    //     return
    // }

    if (processedCmds.length) {
        const processedCmd = processedCmds[index]
        const { targetUids, command } = processedCmd
        if (validateCommand(scene.get(), command))
            interpretCommand({ command, targetUids, scene })
    }

    if (index >= processedCmds.length - 1) {
        endNpcTurn(game)
        return
    }

    game.set('nextAction', {
        index: index + 1,
        delay: TIME_BETWEEN_NPC_MOVES,
        method: 'doNpcTurn',
    })
}

function endNpcTurn(game: Gamecursor) {
    game.set('nextAction', {
        delay: TIME_BETWEEN_NPC_MOVES,
        method: 'endNpcTurn',
    })
}

function validateCommand(scene: BattleScene, command: Command): boolean {
    return command != null && isAlive(scene, command.characterUid)
}
