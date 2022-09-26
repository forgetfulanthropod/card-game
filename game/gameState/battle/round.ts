import type {
    CharacterMeta,
    BattleCursor,
    Command,
    EnemyCharacterMeta,
} from 'shared'

import { enemies } from '@/rulebook'

// TODO: move command definitions into rulebook object
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { commandDefinitionsMap } from '@/rulebook/commandDefinitionsMap'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

export function getNpcMove(
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
