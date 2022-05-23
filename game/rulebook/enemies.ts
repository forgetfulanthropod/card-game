import type { EnemyCharacterName } from 'shared'

type Level = string
// align by regex: (, )|:|\[
const enemies: Record<EnemyCharacterName, Record<Level, EnemyDefinition>> = {
    skeletonWarrior: {
        1: { constitution: 18, strength: 4, dexterity: 7, moves: ['swordWack', null, null, 'block', null] },
        2: { constitution: 27, strength: 6, dexterity: 9, moves: ['swordWack', 'rustyPokeLow', null, 'block', null] },
        3: { constitution: 36, strength: 8, dexterity: 12, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        4: { constitution: 50, strength: 11, dexterity: 16, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        5: { constitution: 65, strength: 14, dexterity: 19, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', null] },
        6: { constitution: 87, strength: 17, dexterity: 22, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(1,1)'] },
        7: { constitution: 101, strength: 20, dexterity: 25, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        8: { constitution: 121, strength: 23, dexterity: 28, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        9: { constitution: 135, strength: 26, dexterity: 31, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
        10: { constitution: 150, strength: 29, dexterity: 34, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
    },
    matchaGelatinCube: {
        1: { constitution: 24, strength: 3, dexterity: 10, moves: ['basicAttack', null, null, 'block', null] },
        2: { constitution: 36, strength: 4, dexterity: 14, moves: ['basicAttack', 'supriseAllergy(1,1)', null, 'block', null] },
        3: { constitution: 55, strength: 6, dexterity: 17, moves: ['basicAttack', 'supriseAllergy(1,1)', 'itchyOoze(1)', 'block', null] },
        4: { constitution: 72, strength: 8, dexterity: 22, moves: ['basicAttack', 'supriseAllergy(2,1)', 'itchyOoze(2)', 'block', null] },
        5: { constitution: 80, strength: 11, dexterity: 26, moves: ['basicAttack', 'supriseAllergy(2,1)', 'itchyOozeSpecial', 'block', null] },
        6: { constitution: 105, strength: 14, dexterity: 31, moves: ['basicAttack', 'supriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        7: { constitution: 130, strength: 15, dexterity: 36, moves: ['basicAttack', 'supriseAllergy(3,2)', 'itchyOoze(2)', 'block', 'engulf(50)'] },
        8: { constitution: 160, strength: 19, dexterity: 41, moves: ['basicAttack', 'supriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        9: { constitution: 175, strength: 22, dexterity: 48, moves: ['basicAttack', 'supriseAllergy(4,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        10: { constitution: 200, strength: 25, dexterity: 56, moves: ['basicAttack', 'supriseAllergy(5,2)', 'itchyOoze(2)', 'block', 'engulf(75)'] },
        large: { constitution: '200-100', strength: 15, dexterity: 20, moves: ['matchaMash', 'matchaMadness', 'matchaMeld', null, null] },
        medium: { constitution: '99-30', strength: 10, dexterity: 10, moves: ['matchaMash', null, null, null, null] },
        small: { constitution: '>29', strength: 10, dexterity: 5, moves: ['matchaMash', null, null, null, null] },
    },
    orcWarrior: {
        1: { constitution: 15, strength: 3, dexterity: 6, moves: ['meatyCharge(1)', null, null, 'block', null] },
        2: { constitution: 33, strength: 4, dexterity: 8, moves: ['meatyCharge(1)', null, null, 'block', null] },
        3: { constitution: 50, strength: 6, dexterity: 10, moves: ['meatyCharge(1)', 'slash', null, 'block', null] },
        4: { constitution: 75, strength: 9, dexterity: 12, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(1,1)', 'block', null] },
        5: { constitution: 88, strength: 12, dexterity: 14, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { constitution: 103, strength: 14, dexterity: 16, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { constitution: 118, strength: 16, dexterity: 19, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { constitution: 133, strength: 18, dexterity: 22, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { constitution: 148, strength: 20, dexterity: 25, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { constitution: 163, strength: 23, dexterity: 28, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    bosshogJurgen: {
        default: { constitution: 190, strength: 30, dexterity: 30, moves: ['jurgenBellyFlop', 'jurgenRollAround', 'jurgenStampSnort', 'block', 'jurgenSitUpon'] },
    },
    mimic: {
        1: { constitution: 39, strength: 3, dexterity: 8, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        2: { constitution: 66, strength: 4, dexterity: 12, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        3: { constitution: 103, strength: 6, dexterity: 16, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        4: { constitution: 129, strength: 8, dexterity: 20, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        5: { constitution: 155, strength: 12, dexterity: 24, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        6: { constitution: 172, strength: 14, dexterity: 28, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        7: { constitution: 205, strength: 16, dexterity: 32, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        8: { constitution: 222, strength: 18, dexterity: 35, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        9: { constitution: 245, strength: 20, dexterity: 38, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        10: { constitution: 264, strength: 22, dexterity: 42, moves: ['mimicAttack', 'chomp', 'infectiousBite(5)', 'block', null] },
    },
    toadmaw: {
        default: { constitution: 132, strength: 25, dexterity: 9, moves: ['hansBuffBlock', 'hansMagicMissile', 'hansGuards', 'hansCurse', null] },
    },
    cultist: {
        default: { constitution: 18, strength: 4, dexterity: 0, moves: ['attack4', null, null, null, null] },
    },
    halfdan: {
        default: { constitution: 250, strength: 25, dexterity: 20, moves: ['rest', 'evisceratingSweep', 'passiveBlock', 'ancientStrike', null] },
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
    moves: readonly [
        EnemyAttackName,
        EnemyAttackName | null,
        EnemyAttackName | null,
        EnemyAttackName | null,
        EnemyAttackName | null
    ]
}
// satisfies<Record<string, EnemyDefinition>>(enemies)
// satisfies<Selfkeys<typeof enemies>>(enemies)

/** TODO: Break this down into the DSL. Do one!! */
export const attackNames = {
    swordWack: 'Sword Whack (BA)',
    mimicAttack:
        'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).',
    rustyPokeHigh: 'Rusty Poke (DOT 2, also applies Fatigue 1)',
    rustyPokeLow: 'Rusty Poke (DOT 2)',
    slash: 'Slash (SL)',
    block: 'Block',
    basicAttack: 'Basic Attack',
    chomp: 'Chomp (BA)',
    itchyOozeSpecial:
        'Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.)',
    jurgenBellyFlop:
        'Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes.',
    jurgenRollAround: 'Roll Around (same as Belly Flop, but with Slash damage)',
    jurgenStampSnort:
        'Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn.',
    jurgenSitUpon:
        'Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target.',
    attack4: 'Attack (Attacks for 4)',
    rest: 'Rest (does nothing)',
    matchaMash: 'Matcha Mash: Matcha will deal damage equal to ATK.',
    matchaMadness: 'Matcha Madness: Apply poison 3 to ALL characters.',
    matchaMeld:
        'Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha.',
    evisceratingSweep:
        'Eviscerating Sweep (Deals 100%, Splash Damage) applies vulnerable (3)',
    passiveBlock:
        'Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block.',
    ancientStrike:
        'Ancient Strike (Deals 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn.',
    hansBuffBlock:
        "Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn).",
    hansMagicMissile: 'Magic Missile (attacks for 25)',
    hansGuards: 'Guards!!! (summons up to 2 cultist guards)',
    hansCurse:
        'Blood Moon Curse (all player characters receive fatigue (2), unguarded (2))',
} as const

const _parameterizedAttacks = {
    startlingSpook: 'Startling Spook (Applies Unguarded x, Fatigue x)',
    supriseAllergy:
        'Surprise Allergy (Deals 50% of attack damage, applies Poison X if unblocked, Fatigue X)',
    itchyOoze: 'Itchy Ooze (DOT X)',
    infectiousBite:
        'Infectious Bite (DOT1, applies poison (X) if 5 or more damage goes unblocked)',
    engulf: 'Engulf (Deals X% of attack damage, applies Stun if any damage goes unblocked)',
    meatyCharge:
        'Meaty Charge (BA, applies bleed (X) if any damage goes unblocked)',
    bellowAndSing:
        'Bellow and Sing, deals 50% of attack damage, applies fatigue (X) (applies debilatated (X) if any damage goes unblocked)',
    screamAndCharge:
        'Scream and Charge (Deals X% of attack damage, applies Unguarded (X) after)',
}

export type EnemyAttackName =
    | keyof typeof attackNames
    | `startlingSpook(${number},${number})`
    | `supriseAllergy(${number},${number})`
    | `itchyOoze(${number})`
    | `infectiousBite(${number})`
    | `engulf(${number})`
    | `meatyCharge(${number})`
    | `bellowAndSing(${number},${number})`
    | `screamAndCharge(${number},${number})`
