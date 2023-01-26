import { BattleCursor, Command, EnemyCharacterMeta } from 'shared'
import { commandDefinitionsMap } from '@/rulebook/commandDefinitionsMap'
import { getRulebook } from '@/rulebook'

export function getNpcMove(
    scene: BattleCursor,
    attacker: EnemyCharacterMeta
): Command | null {
    // TODO: handle levels correctly instead of just using the first defined level
    const enemy = getRulebook().npcStatsMapByLevel[attacker.id][attacker.level]
    const moves = enemy.moves
    const move = moves[(scene.get('turnCount') - 1) % moves.length]
    if (move == null) return move

    return {
        ...commandDefinitionsMap[move],
        characterUid: attacker.uid,
    }
}
