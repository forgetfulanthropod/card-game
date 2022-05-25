import type {
    AttackData,
    CharacterMeta,
    CharacterMove,
    BattleCursor,
} from 'shared'

import { getDefenders, getPCTarget } from './characterGetters'
import { getTransformed, isSpecial } from './specialMoves'
import { vals, randomEl } from '@/util'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

function getRandomMove(
    attacker: CharacterMeta,
    scene: BattleCursor
): CharacterMove {
    const moves = attacker.moves
    let move = randomEl(moves)

    if (isSpecial(move))
        move = getTransformed({ move, charUid: attacker.uid, scene })

    return move
}

function getNpcMove(scene: BattleCursor, attacker: CharacterMeta): AttackData {
    const ac = vals(scene.get('allCharacters'))

    const move = getRandomMove(attacker, scene)
    const defender = getPCTarget(ac)

    const defenders = getDefenders(defender, move, ac)

    return { attacker, defenders, move }
}

export function getNpcMoves(scene: BattleCursor): AttackData[] {
    const ac = vals(scene.get('allCharacters'))
    const movable = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    return movable.map(attacker => getNpcMove(scene, attacker))
}
