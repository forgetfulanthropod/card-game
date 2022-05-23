import type {
    CharacterMeta,
    BattleCursor,
    Card,
    EnemyCharacterName,
    CardId,
} from 'shared'

import { nonNulls, vals } from 'shared/code'
import { cardDefinitionsMap, enemies } from '@/rulebook'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

function getNpcMove(scene: BattleCursor, attacker: CharacterMeta): Card | null {
    const attackerName = attacker.name as EnemyCharacterName
    // TODO: handle levels correctly instead of just using the first defined level
    const enemy = vals(enemies[attackerName])[0]
    const moves = enemy.moves
    const move = moves[scene.get('turnCount') % moves.length]
    if (move == null) return move
    // TODO: reconcile CardId with EnemyAttackName
    const cardName = move as CardId
    return {
        ...cardDefinitionsMap[cardName],
        uid: srandom().toString().slice(6),
        explanation: '', // TODO?
        characterUid: attacker.uid,
    }
}

export function getNpcMoves(scene: BattleCursor): Card[] {
    const ac = vals(scene.get('allCharacters'))
    const movable = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    return nonNulls(movable.map(attacker => getNpcMove(scene, attacker)))
}
