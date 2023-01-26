import type { BattleCursor, NextCommand } from 'shared'
import { nonNulls } from 'shared/code'
import { simulateCommand } from '../cards'
import { getLivingNpcs, getCommandTargets } from './characterGetters'
import { getNpcMove } from './getNpcMove'

export function getNpcMoves(scene: BattleCursor): NextCommand[] {
    const movable = getLivingNpcs(scene.get())

    const cmds = nonNulls(movable.map(attacker => getNpcMove(scene, attacker)))

    // logger.info(JSON.stringify({ cmds }))

    return cmds.map(command => {
        const targetUids = getCommandTargets(scene.get(), command)
        const outcome = simulateCommand({ command, scene, targetUids })

        return {
            command,
            targetUids,
            outcome,
        }
    })
}

export function updateNpcMoves(scene: BattleCursor) {
    scene.select('nextNpcCommands').set(getNpcMoves(scene))
}
