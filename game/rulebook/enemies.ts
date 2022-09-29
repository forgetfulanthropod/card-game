import type { EnemyCharacterId, NpcCommandId } from 'shared'
type Level = string
export const enemies: Record<EnemyCharacterId, Record<Level, EnemyDefinition>> = {
    skeletonWarrior: {
        // 1: { level: '1', wisdom: 0, constitution: 18, strength: 4, defense: 7, moves: ['swordWack', null, null, 'block', null] },
        1: { level: '1', wisdom: 0, constitution: 19, strength: 10, defense: 7, moves: ['swordWack', 'swordWack', 'jab', 'strike', 'jab'] },
        2: { level: '2', wisdom: 0, constitution: 27, strength: 14, defense: 9, moves: ['swordWack', 'rustyPokeLow', 'swordWack', 'block', 'swordWack'] },
        3: { level: '3', wisdom: 0, constitution: 36, strength: 18, defense: 12, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        4: { level: '4', wisdom: 0, constitution: 50, strength: 22, defense: 16, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        5: { level: '5', wisdom: 0, constitution: 65, strength: 26, defense: 19, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        6: { level: '6', wisdom: 0, constitution: 87, strength: 30, defense: 22, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(1,1)'] },
        7: { level: '7', wisdom: 0, constitution: 101, strength: 34, defense: 25, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        8: { level: '8', wisdom: 0, constitution: 121, strength: 38, defense: 28, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        9: { level: '9', wisdom: 0, constitution: 135, strength: 42, defense: 31, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
        10: { level: '10', wisdom: 0, constitution: 150, strength: 46, defense: 34, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
    },
    matchaGelatinCube: {
        // 1: { level: '1', wisdom: 0, constitution: 1, strength: 3, defense: 10, moves: ['basicAttack', 'block', 'basicAttack', 'block', 'basicAttack'] },
        1: { level: '1', wisdom: 0, constitution: 22, strength: 8, defense: 10, moves: ['basicAttack', 'block', 'basicAttack', 'block', 'basicAttack'] },
        2: { level: '2', wisdom: 0, constitution: 36, strength: 14, defense: 14, moves: ['basicAttack', 'surpriseAllergy(1,1)', 'block', 'basicAttack', 'block'] },
        3: { level: '3', wisdom: 0, constitution: 55, strength: 20, defense: 17, moves: ['basicAttack', 'surpriseAllergy(1,1)', 'itchyOoze(1)', 'block', null] },
        4: { level: '4', wisdom: 0, constitution: 72, strength: 26, defense: 22, moves: ['basicAttack', 'surpriseAllergy(2,1)', 'itchyOoze(2)', 'block', null] },
        5: { level: '5', wisdom: 0, constitution: 80, strength: 32, defense: 26, moves: ['basicAttack', 'surpriseAllergy(2,1)', 'itchyOozeSpecial', 'block', null] },
        6: { level: '6', wisdom: 0, constitution: 105, strength: 38, defense: 31, moves: ['basicAttack', 'surpriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        7: { level: '7', wisdom: 0, constitution: 130, strength: 44, defense: 36, moves: ['basicAttack', 'surpriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        8: { level: '8', wisdom: 0, constitution: 160, strength: 50, defense: 41, moves: ['basicAttack', 'surpriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        9: { level: '9', wisdom: 0, constitution: 175, strength: 56, defense: 48, moves: ['basicAttack', 'surpriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        10: { level: '10', wisdom: 0, constitution: 200, strength: 62, defense: 56, moves: ['basicAttack', 'surpriseAllergy(5,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        large: { level: 'large', wisdom: 0, constitution: '200-100', strength: 68, defense: 20, moves: ['matchaMash', 'matchaMadness', 'matchaMeld', null, null] },
        medium: { level: 'medium', wisdom: 0, constitution: '99-30', strength: 74, defense: 10, moves: ['matchaMash', null, null, null, null] },
        small: { level: 'small', wisdom: 0, constitution: '>29', strength: 80, defense: 5, moves: ['matchaMash', null, null, null, null] },
    },
    gnomeHooligan: {
        1: { level: '1', wisdom: 0, constitution: 10, strength: 10, defense: 6, moves: ['gnomeBomb', null, null, 'block', null] },
        2: { level: '2', wisdom: 0, constitution: 12, strength: 12, defense: 8, moves: ['gnomeBomb', null, null, 'block', null] },
        3: { level: '3', wisdom: 0, constitution: 14, strength: 14, defense: 10, moves: ['gnomeBomb', 'slash', null, 'block', null] },
        4: { level: '4', wisdom: 0, constitution: 16, strength: 16, defense: 12, moves: ['gnomeBomb', 'slash', 'bellowAndSing(1,1)', 'block', null] },
        5: { level: '5', wisdom: 0, constitution: 18, strength: 18, defense: 14, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { level: '6', wisdom: 0, constitution: 20, strength: 20, defense: 16, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { level: '7', wisdom: 0, constitution: 22, strength: 22, defense: 19, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { level: '8', wisdom: 0, constitution: 24, strength: 24, defense: 22, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { level: '9', wisdom: 0, constitution: 26, strength: 26, defense: 25, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { level: '10', wisdom: 0, constitution: 28, strength: 28, defense: 28, moves: ['gnomeBomb', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    orcWarrior: {
        1: { level: '1', wisdom: 0, constitution: 15, strength: 14, defense: 6, moves: ['meatyCharge(1)', null, null, 'block', null] },
        2: { level: '2', wisdom: 0, constitution: 33, strength: 20, defense: 8, moves: ['meatyCharge(1)', null, null, 'block', null] },
        3: { level: '3', wisdom: 0, constitution: 50, strength: 26, defense: 10, moves: ['meatyCharge(1)', 'slash', null, 'block', null] },
        4: { level: '4', wisdom: 0, constitution: 75, strength: 32, defense: 12, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(1,1)', 'block', null] },
        5: { level: '5', wisdom: 0, constitution: 88, strength: 38, defense: 14, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { level: '6', wisdom: 0, constitution: 103, strength: 44, defense: 16, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { level: '7', wisdom: 0, constitution: 118, strength: 50, defense: 19, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { level: '8', wisdom: 0, constitution: 133, strength: 56, defense: 22, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { level: '9', wisdom: 0, constitution: 148, strength: 62, defense: 25, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { level: '10', wisdom: 0, constitution: 163, strength: 68, defense: 28, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    bosshogJurgen: {
        default: { level: 'default', wisdom: 0, constitution: 190, strength: 30, defense: 30, moves: ['jurgenBellyFlop', 'jurgenRollAround', 'jurgenStampSnort', 'block', 'jurgenSitUpon'] },
    },
    mimic: {
        1: { level: '1', wisdom: 0, constitution: 39, strength: 3, defense: 8, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        2: { level: '2', wisdom: 0, constitution: 66, strength: 4, defense: 12, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        3: { level: '3', wisdom: 0, constitution: 103, strength: 6, defense: 16, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        4: { level: '4', wisdom: 0, constitution: 129, strength: 8, defense: 20, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        5: { level: '5', wisdom: 0, constitution: 155, strength: 12, defense: 24, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        6: { level: '6', wisdom: 0, constitution: 172, strength: 14, defense: 28, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        7: { level: '7', wisdom: 0, constitution: 205, strength: 16, defense: 32, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        8: { level: '8', wisdom: 0, constitution: 222, strength: 18, defense: 35, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        9: { level: '9', wisdom: 0, constitution: 245, strength: 20, defense: 38, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        10: { level: '10', wisdom: 0, constitution: 264, strength: 22, defense: 42, moves: ['mimicAttack', 'chomp', 'infectiousBite(5)', 'block', null] },
    },
    toadmaw: {
        default: { level: 'default', wisdom: 0, constitution: 132, strength: 25, defense: 9, moves: ['hansBuffBlock', 'hansMagicMissile', 'hansGuards', 'hansCurse', null] },
    },
    cultist: {
        default: { level: 'default', wisdom: 0, constitution: 18, strength: 4, defense: 0, moves: ['attack4', null, null, null, null] },
    },
    halfdan: {
        default: { level: 'default', wisdom: 0, constitution: 250, strength: 25, defense: 20, moves: ['rest', 'evisceratingSweep', 'passiveBlockCmd', 'ancientStrike', null] },
    },
} as const // prettier-ignore

export type BaseHealth = number | `${number}-${number}` | `>${number}`
export type EnemyDefinition = {
    // displayName: string
    // level: number | string | null
    // id: string
    constitution: BaseHealth
    strength: number
    defense: number
    wisdom: number
    level: number | string
    // TODO: rename to commands
    moves: readonly (NpcCommandId | null)[]
}
