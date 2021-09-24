import { stanceTypeMetaMap, moveTypeMetaMap } from './constants'

export function getId(x: number, y: number): string { return `${x}-${y}` }

export function getClosest(allCharacters: CharacterMeta[], character: CharacterMeta, nthClosest: number): CharacterMeta {
    return [...allCharacters]
        .filter(c => c.isPlayerCharacter === character.isPlayerCharacter)
        .sort((a, b) => dist([a.x, a.y], [character.x, character.y]) - dist([b.x, b.y], [character.x, character.y]))[nthClosest]
}

function dist([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getUnmovedNpc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => !c.isPlayerCharacter && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}


export function getUnmovedPc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => c.isPlayerCharacter && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}

export function getPCTarget(ac: CharacterMeta[]): CharacterMeta {
    const allLivingPlayerCharacters = ac
        .filter(c => c.isPlayerCharacter && c.health > 0)

    const targetIndex = weightedRandom(
        allLivingPlayerCharacters
            .map(c => stanceTypeMetaMap[c.stance].targetLikelihood)
    )

    return allLivingPlayerCharacters[targetIndex]
}

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPlayerCharacter || c.health <= 0))
        return 'PC'
    if (ac.every(c => !c.isPlayerCharacter || c.health <= 0))
        return 'NPC'
    return null
}

// TODO: should be at least one person...
export function checkMoveAvailable(ac: CharacterMeta[]): boolean {
    return ac.some(c => c.isPlayerCharacter && c.health >= 0 && !c.hasMoved)
        || ac.some(c => !c.isPlayerCharacter && c.health >= 0 && !c.hasMoved)
}


export function getRandomMove(attacker: CharacterMeta): MoveMeta {
    return randomEl(attacker.moves)
}

export function getNpcMove(ac: CharacterMeta[]): AttackData {
    const attacker = getUnmovedNpc(ac)
    if (attacker == null) {
        throw Error('no unmoved NPC')
    }

    const move = getRandomMove(attacker)
    const defenders = [getPCTarget(ac)]

    if (moveTypeMetaMap[move.type].numTargets > defenders.length) {
        getClosest(ac, defenders[0], defenders.length)
    }

    return { attacker, defenders, move }
}


export function randomEl<T>(arr: T[]): T {
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
