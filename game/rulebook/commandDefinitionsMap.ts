import type { CommandDefinition, NpcCommandId } from 'shared'

// TODO eventually: remove ? before : below
type CommandDefinitionsMap = {
    [Id in NpcCommandId]: CommandDefinition & { id: Id }
}

export const commandDefinitionsMap: CommandDefinitionsMap = {
    swordWack: {
        id: 'swordWack',
        name: 'Sword Wack',

        actions: 'deal(strength)',
        targetNum: 1,
        targetType: 'enemies',
    },
    jab: {
        name: 'Jab',
        id: 'jab',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength * .5)',
    },
    strike: {
        name: 'Strike',
        id: 'strike',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength + 2)',
    },
}

export const commandDescriptions = {
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
const parameterizedCommandDescriptions = {
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
} as const

// export type CommandId =
//     | keyof typeof commandDescriptions
//     | keyof typeof parameterizedCommandDescriptions

// no longer relevant?:
// | `startlingSpook(${number},${number})`
// | `supriseAllergy(${number},${number})`
// | `itchyOoze(${number})`
// | `infectiousBite(${number})`
// | `engulf(${number})`
// | `meatyCharge(${number})`
// | `bellowAndSing(${number},${number})`
// | `screamAndCharge(${number},${number})`
