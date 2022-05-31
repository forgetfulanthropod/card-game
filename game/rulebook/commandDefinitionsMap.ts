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

const toAction = {
    swordWack: 'deal(strength)',
    /** Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).*/
    mimicAttack: 'mimicAttack()',
    /**Rusty Poke (DOT 2, also applies Fatigue 1) */
    rustyPokeHigh: 'dot(2); effect("fatigue", 1)',
    /**Rusty Poke (DOT 2) */
    rustyPokeLow: 'dot(2)',
    /**Slash (SL) */
    slash: 'deal(strength/2)',
    /**'Block' */
    block: 'addBlock(dexterity)',
    /**Basic Attack */
    basicAttack: 'deal(strength)',
    /**Chomp (BA) */
    chomp: 'deal(strength)',
    /**Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.) */
    itchyOozeSpecial: 'ifDamageDealt(dot(2), effect("poison", 1))',
    /**Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes. */
    jurgenBellyFlop: 'deal(min1(30 - damageTaken()))',
    /**Roll Around (same as Belly Flop, but with Slash damage) */
    jurgenRollAround: 'deal(30 - damageTaken())',
    /**Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn. */
    jurgenStampSnort: 'effect("doubleDamage", 1)',
    /**Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target. */
    jurgenSitUpon: 'deal(strength/2); effect("stun",1)',
    /**Attack (Attacks for 4) */
    attack4: 'deal(4)',
    /**Rest (does nothing) */
    rest: 'rest()',
    /**Matcha Mash: Matcha will deal damage equal to ATK. */
    matchaMash: 'deal(strength)',
    /**Matcha Madness: Apply poison 3 to ALL characters. */
    matchaMadness: 'effect("poison", 3, "all")',
    /**Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha. */
    matchaMeld: '',
    /**Eviscerating Sweep (Deals 100%, Splash Damage) applies vulnerable (3) */
    evisceratingSweep: 'deal(strength); effect("vulnerable", 3)',
    /**Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block. */
    passiveBlock: 'effect("passiveBlock", 20)',
    /**Ancient Strike (Deals 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn. */
    ancientStrike: 'ifDamageDealt(deal(strength * 2), effect("stun", 1))',
    /**Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn). */
    hansBuffBlock: 'effect("smallDamageBonus", 2, "friends")',
    /**Magic Missile (attacks for 25) */
    hansMagicMissile: 'deal(25)',
    /**Guards!!! (summons up to 2 cultist guards) */
    hansGuards: 'summon("cultistGuard"); summon("cultistGuard")',
    /**Blood Moon Curse (all player characters receive fatigue (2), unguarded (2)) */
    hansCurse:
        'effect("fatigue", 2, "enemies"); effect("unguarded", 2, "enemies")',
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

// no longer relevant?:
// | `startlingSpook(${number},${number})`
// | `supriseAllergy(${number},${number})`
// | `itchyOoze(${number})`
// | `infectiousBite(${number})`
// | `engulf(${number})`
// | `meatyCharge(${number})`
// | `bellowAndSing(${number},${number})`
// | `screamAndCharge(${number},${number})`
