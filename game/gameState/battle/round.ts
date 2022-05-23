import type { CharacterMeta, BattleCursor, Card } from 'shared'

import { vals } from 'shared/code'
import { cardDefinitionsMap } from '@/rulebook'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

// TODO
function getNpcMove(scene: BattleCursor, attacker: CharacterMeta): Card {
    return {
        ...cardDefinitionsMap.strike,
        uid: srandom().toString().slice(6),
        explanation: '', // TODO
        characterUid: attacker.uid,
    }
}

export function getNpcMoves(scene: BattleCursor): Card[] {
    const ac = vals(scene.get('allCharacters'))
    const movable = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    return movable.map(attacker => getNpcMove(scene, attacker))
}
