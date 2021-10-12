import { moveModiferMap, stanceTypeMetaMap } from '@@/db/battle/constants'
import { AttackData, CharacterMeta, CharacterMove, MoveModifierName } from '../types'

export function getId(x: number, y: number): string { return `${x}-${y}` }

export function getClosestAlive(allCharacters: CharacterMeta[], character: CharacterMeta, nthClosest: number): CharacterMeta | null {
    const charDist = (a: CharacterMeta, b: CharacterMeta) =>
        dist([a.x, a.y], [character.x, character.y]) - dist([b.x, b.y], [character.x, character.y])
    return [...allCharacters]
        .filter(c => c.isPc === character.isPc && c.health > 0)
        .sort((a, b) => charDist(a, b))[nthClosest]
}

function dist([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getUnmovedNpc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}


export function getUnmovedPc(ac: CharacterMeta[], excludeId: string): CharacterMeta | null {
    const chars = ac.filter(c => c.isPc && c.health > 0 && !c.hasMoved && c.uid !== excludeId)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}

export function getPCTarget(ac: CharacterMeta[]): CharacterMeta {
    const allLivingPlayerCharacters = ac
        .filter(c => c.isPc && c.health > 0)

    const targetIndex = weightedRandom(
        allLivingPlayerCharacters
            .map(c => stanceTypeMetaMap[c.stance].targetLikelihood)
    )

    return allLivingPlayerCharacters[targetIndex]
}

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


export function getRandomMove(attacker: CharacterMeta): CharacterMove {
    const moves = attacker.moves
    const result = randomEl(moves)
    return result
}

export function getNpcMove(ac: CharacterMeta[]): AttackData {
    const attacker = getUnmovedNpc(ac)
    if (attacker == null) {
        throw Error('no unmoved NPC')
    }

    const move = getRandomMove(attacker)
    const defenders = [getPCTarget(ac)]

    const mainType: MoveModifierName = move.types[0]
    if (moveModiferMap[mainType].numTargets > 1) {
        const closest = getClosestAlive(ac, defenders[0], 1)
        if (closest != null)
            defenders.push(closest)
    }

    // console.log('defenders:', defenders)
    return { attacker, defenders, move }
}


export function randomEl<T>(arr: readonly T[]): T {
    return arr[Math.random() * arr.length | 0]
}


/** Returns index of chosen element */
export function weightedRandom(probabilites: number[]): number {
    if (probabilites.some(x => Number.isNaN(x) || !Number.isFinite(x) || x < 0)) {
        console.error('array contains NaN or Inf or negative numbers')
        return 0
    }
    let runningTotal = 0
    const runningTotals = []
    for (let i = 0; i < probabilites.length; i++) {
        runningTotal += probabilites[i]
        runningTotals[i] = runningTotal
    }
    const total = runningTotal
    const x = Math.random() * total
    const index = runningTotals.findIndex(t => t > x)
    if (index !== -1) return index
    // hits e.g. when all probabilities are 0
    return Math.random() * probabilites.length | 0
}


// TODO: jest/mocha?
// export function test(A) {
//     const counts = A.map(() => 0)
//     const n = 10000
//     for (let i = 0; i < n; i++) {
//         counts[weightedRandom(A)] += 1
//     }
//     return counts.map(x => x / n)
// }
