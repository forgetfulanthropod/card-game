import type {
    CharacterMeta,
    BattleCursor,
    Command,
    NextCommand,
    EnemyCharacterMeta,
} from 'shared'

import { nonNulls } from 'shared/code'
import { simulateCommand } from './cards'
import { getLivingNpcs, getCommandTargets } from './characterGetters'
import { enemies } from '@/rulebook'

// TODO: move command definitions into rulebook object
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { commandDefinitionsMap } from '@/rulebook/commandDefinitionsMap'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

function getNpcMove(
    scene: BattleCursor,
    attacker: EnemyCharacterMeta
): Command | null {
    // TODO: handle levels correctly instead of just using the first defined level
    const enemy = enemies[attacker.id][attacker.level]
    const moves = enemy.moves
    const move = moves[(scene.get('turnCount') - 1) % moves.length]
    if (move == null) return move

    return {
        ...commandDefinitionsMap[move],
        characterUid: attacker.uid,
    }
}

export function getNpcMoves(scene: BattleCursor): NextCommand[] {
    const movable = getLivingNpcs(scene.get())

    const cmds = nonNulls(movable.map(attacker => getNpcMove(scene, attacker)))

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
