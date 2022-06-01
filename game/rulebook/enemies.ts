import type { EnemyCharacterName, NpcCommandId } from 'shared'
type Level = string
// @ts-expect-error // TODO
export const enemies: Record<EnemyCharacterName, Record<Level, EnemyDefinition>> = {
    skeletonWarrior: {
        // 1: { wisdom: 0, constitution: 18, strength: 4, dexterity: 7, moves: ['swordWack', null, null, 'block', null] },
        1: { wisdom: 0, constitution: 18, strength: 4, dexterity: 7, moves: ['swordWack', 'swordWack', 'jab', 'strike', 'jab'] },
        2: { wisdom: 0, constitution: 27, strength: 6, dexterity: 9, moves: ['swordWack', 'rustyPokeLow', null, 'block', null] },
        3: { wisdom: 0, constitution: 36, strength: 8, dexterity: 12, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        4: { wisdom: 0, constitution: 50, strength: 11, dexterity: 16, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        5: { wisdom: 0, constitution: 65, strength: 14, dexterity: 19, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        6: { wisdom: 0, constitution: 87, strength: 17, dexterity: 22, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(1,1)'] },
        7: { wisdom: 0, constitution: 101, strength: 20, dexterity: 25, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        8: { wisdom: 0, constitution: 121, strength: 23, dexterity: 28, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        9: { wisdom: 0, constitution: 135, strength: 26, dexterity: 31, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
        10: { wisdom: 0, constitution: 150, strength: 29, dexterity: 34, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
    },
    matchaGelatinCube: {
        1: { wisdom: 0, constitution: 24, strength: 3, dexterity: 10, moves: ['basicAttack', null, null, 'block', null] },
        2: { wisdom: 0, constitution: 36, strength: 4, dexterity: 14, moves: ['basicAttack', 'surpriseAllergy(1,1)', null, 'block', null] },
        3: { wisdom: 0, constitution: 55, strength: 6, dexterity: 17, moves: ['basicAttack', 'surpriseAllergy(1,1)', 'itchyOoze(1)', 'block', null] },
        4: { wisdom: 0, constitution: 72, strength: 8, dexterity: 22, moves: ['basicAttack', 'surpriseAllergy(2,1)', 'itchyOoze(2)', 'block', null] },
        5: { wisdom: 0, constitution: 80, strength: 11, dexterity: 26, moves: ['basicAttack', 'surpriseAllergy(2,1)', 'itchyOozeSpecial', 'block', null] },
        6: { wisdom: 0, constitution: 105, strength: 14, dexterity: 31, moves: ['basicAttack', 'surpriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        7: { wisdom: 0, constitution: 130, strength: 15, dexterity: 36, moves: ['basicAttack', 'surpriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        8: { wisdom: 0, constitution: 160, strength: 19, dexterity: 41, moves: ['basicAttack', 'surpriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        9: { wisdom: 0, constitution: 175, strength: 22, dexterity: 48, moves: ['basicAttack', 'surpriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        10: { wisdom: 0, constitution: 200, strength: 25, dexterity: 56, moves: ['basicAttack', 'surpriseAllergy(5,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        large: { wisdom: 0, constitution: '200-100', strength: 15, dexterity: 20, moves: ['matchaMash', 'matchaMadness', 'matchaMeld', null, null] },
        medium: { wisdom: 0, constitution: '99-30', strength: 10, dexterity: 10, moves: ['matchaMash', null, null, null, null] },
        small: { wisdom: 0, constitution: '>29', strength: 10, dexterity: 5, moves: ['matchaMash', null, null, null, null] },
    },
    orcWarrior: {
        1: { wisdom: 0, constitution: 15, strength: 3, dexterity: 6, moves: ['meatyCharge(1)', null, null, 'block', null] },
        2: { wisdom: 0, constitution: 33, strength: 4, dexterity: 8, moves: ['meatyCharge(1)', null, null, 'block', null] },
        3: { wisdom: 0, constitution: 50, strength: 6, dexterity: 10, moves: ['meatyCharge(1)', 'slash', null, 'block', null] },
        4: { wisdom: 0, constitution: 75, strength: 9, dexterity: 12, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(1,1)', 'block', null] },
        5: { wisdom: 0, constitution: 88, strength: 12, dexterity: 14, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { wisdom: 0, constitution: 103, strength: 14, dexterity: 16, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { wisdom: 0, constitution: 118, strength: 16, dexterity: 19, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { wisdom: 0, constitution: 133, strength: 18, dexterity: 22, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { wisdom: 0, constitution: 148, strength: 20, dexterity: 25, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { wisdom: 0, constitution: 163, strength: 23, dexterity: 28, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    bosshogJurgen: {
        default: { wisdom: 0, constitution: 190, strength: 30, dexterity: 30, moves: ['jurgenBellyFlop', 'jurgenRollAround', 'jurgenStampSnort', 'block', 'jurgenSitUpon'] },
    },
    mimic: {
        1: { wisdom: 0, constitution: 39, strength: 3, dexterity: 8, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        2: { wisdom: 0, constitution: 66, strength: 4, dexterity: 12, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        3: { wisdom: 0, constitution: 103, strength: 6, dexterity: 16, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        4: { wisdom: 0, constitution: 129, strength: 8, dexterity: 20, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        5: { wisdom: 0, constitution: 155, strength: 12, dexterity: 24, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        6: { wisdom: 0, constitution: 172, strength: 14, dexterity: 28, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        7: { wisdom: 0, constitution: 205, strength: 16, dexterity: 32, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        8: { wisdom: 0, constitution: 222, strength: 18, dexterity: 35, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        9: { wisdom: 0, constitution: 245, strength: 20, dexterity: 38, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        10: { wisdom: 0, constitution: 264, strength: 22, dexterity: 42, moves: ['mimicAttack', 'chomp', 'infectiousBite(5)', 'block', null] },
    },
    toadmaw: {
        default: { wisdom: 0, constitution: 132, strength: 25, dexterity: 9, moves: ['hansBuffBlock', 'hansMagicMissile', 'hansGuards', 'hansCurse', null] },
    },
    cultist: {
        default: { wisdom: 0, constitution: 18, strength: 4, dexterity: 0, moves: ['attack4', null, null, null, null] },
    },
    halfdan: {
        default: { wisdom: 0, constitution: 250, strength: 25, dexterity: 20, moves: ['rest', 'evisceratingSweep', 'passiveBlock', 'ancientStrike', null] },
    },
} as const // prettier-ignore

type BaseHealth = number | `${number}-${number}` | `>${number}`
type Selfkeys<T> = { [K in keyof T]: { id: K } }
export type EnemyDefinition = {
    // displayName: string
    // level: number | string | null
    // id: string
    constitution: BaseHealth
    strength: number
    dexterity: number
    wisdom: number
    // TODO: rename to commands
    moves: readonly (NpcCommandId | null)[]
}
