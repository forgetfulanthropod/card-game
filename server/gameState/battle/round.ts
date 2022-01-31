import type { AttackData, CharacterMeta, CharacterMove } from '@shared'

import type { BattleCursor } from '@/util'
import { randomEl } from '@/util'

import { getDefenders, getPCTarget, getUnmovedNpc } from './characterGetters'
import { getTransformed, isSpecial } from './specialMoves'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}

// TODO: should be at least one person...
export function checkMoveAvailable(ac: CharacterMeta[]): boolean {
    return (
        ac.some(c => c.isPc && c.health > 0 && !c.hasMoved) ||
        ac.some(c => !c.isPc && c.health > 0 && !c.hasMoved)
    )
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

export function getNpcMove(
    ac: CharacterMeta[],
    scene: BattleCursor
): AttackData {
    const attacker = getUnmovedNpc(ac)
    if (attacker == null) {
        throw Error('no unmoved NPC')
    }

    const move = getRandomMove(attacker, scene)
    const defender = getPCTarget(ac)

    const defenders = getDefenders(defender, move, ac)

    return { attacker, defenders, move }
}
