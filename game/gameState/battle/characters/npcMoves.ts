import { SBaobab } from 'sbaobab'
import type { BattleCursor, CommandOutcome, NextCommand } from 'shared'
import { nonNulls } from 'shared/code'
import { simulateCommand } from '../cards'
import { popAndRunQueue } from '../queueUtil'
import { getLivingNpcs, getCommandTargets } from './characterGetters'
import { getNpcMove } from './getNpcMove'

export function getNpcMoves(scene: BattleCursor): NextCommand[] {
    const movable = getLivingNpcs(scene.get())

    const cmds = nonNulls(movable.map(attacker => getNpcMove(scene, attacker)))

    // logger.info(JSON.stringify({ cmds }))

    let simulatedScene = new SBaobab(scene.deepClone()).select()

    return cmds.map(command => {
        const targetUids = getCommandTargets(scene.get(), command)
        let outcome: CommandOutcome
        ;[outcome, simulatedScene] = simulateCommand({
            command,
            scene: simulatedScene,
            targetUids,
        })

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
