import type {
    CharacterMeta,
    BattleCursor,
    EnemyCharacterName,
    Command,
    CommandOutcome,
} from 'shared'

import { nonNulls, vals } from 'shared/code'
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
    attacker: CharacterMeta
): Command | null {
    const attackerName = attacker.name as EnemyCharacterName
    // TODO: handle levels correctly instead of just using the first defined level
    const enemy = vals(enemies[attackerName])[0]
    const moves = enemy.moves
    const move = moves[scene.get('turnCount') % moves.length]
    if (move == null) return move

    // TODO: reconcile CardId with EnemyAttackName
    return {
        ...commandDefinitionsMap[move],
        // uid: srandom().toString().slice(6),
        characterUid: attacker.uid,
    }
}

export function getNpcMoves(
    scene: BattleCursor
): { command: Command; outcome: CommandOutcome }[] {
    const ac = vals(scene.get('allCharacters'))
    const movable = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    const cmds = nonNulls(movable.map(attacker => getNpcMove(scene, attacker)))
    return cmds.map(command => ({
        command,
        // TODO: actually calculate damages ahead of time
        outcome: { damages: {} },
    }))
}
