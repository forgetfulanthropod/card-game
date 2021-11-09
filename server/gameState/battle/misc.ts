import type { AttackData, CharacterMeta, CharacterMove } from '@shared'

import { getDefenders, getPCTarget, getUnmovedNpc } from './characterGetters'
import { getTransformed, isSpecial } from './specialMoves'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0))
        return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0))
        return 'NPC'
    return null
}

// TODO: should be at least one person...
export function checkMoveAvailable(ac: CharacterMeta[]): boolean {
    return ac.some(c => c.isPc && c.health > 0 && !c.hasMoved)
        || ac.some(c => !c.isPc && c.health > 0 && !c.hasMoved)
}


function getRandomMove(attacker: CharacterMeta): CharacterMove {
    const moves = attacker.moves
    let move = randomEl(moves)

    if (isSpecial(move)) move = getTransformed(move, attacker.uid)

    return move
}

export function getNpcMove(ac: CharacterMeta[]): AttackData {
    const attacker = getUnmovedNpc(ac)
    if (attacker == null) {
        throw Error('no unmoved NPC')
    }

    const move = getRandomMove(attacker)
    const defender = getPCTarget(ac)

    const defenders = getDefenders(defender, move, ac)


    return { attacker, defenders, move }
}


export function randomEl<T>(arr: readonly T[]): T {
    return arr[srandom() * arr.length | 0]
}


/** Returns index of chosen element */
export function weightedRandom(probabilites: number[]): number {
    if (probabilites.some(x => Number.isNaN(x) || !Number.isFinite(x) || x < 0)) {
        logger.error('array contains NaN or Inf or negative numbers')
        return 0
    }
    let runningTotal = 0
    const runningTotals = []
    for (let i = 0; i < probabilites.length; i++) {
        runningTotal += probabilites[i]
        runningTotals[i] = runningTotal
    }
    const total = runningTotal
    const x = srandom() * total
    const index = runningTotals.findIndex(t => t > x)
    if (index !== -1) return index
    // hits e.g. when all probabilities are 0
    return srandom() * probabilites.length | 0
}
