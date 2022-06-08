import type { CommandDefinition, NpcCommandId } from 'shared'
import { entryMap } from 'shared/code'
import { enemies } from './enemies'
import * as alias from './commandAliases'
// TODO eventually: remove ? before : below
type CommandDefinitionsMap = {
    [Id in NpcCommandId]: CommandDefinition & { id: Id }
}

/**
 * simple commands which targe one opponent
 * no friendly targets allowed!!!
 **/
const singleOpponentTargetCommands = {
    swordWack: ['Sword Wack', 'deal(strength)'],
    /** Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).*/
    mimicAttack: ['Mimic Attack', 'mimicAttack()'],
    /**Rusty Poke (DOT 2, also applies Fatigue 1) */
    rustyPokeHigh: ['Rusty Poke High', 'deal(strength); effect("fatigue", 1)'],
    /**Rusty Poke (DOT 2) */
    rustyPokeLow: ['Rusty Poke Low', 'deal(strength)'],
    /**Basic Attack */
    basicAttack: ['Basic Attack', 'deal(strength)'],
    /**Chomp (BA) */
    chomp: ['Chomp', 'deal(strength)'],
    /**Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.) */
    itchyOozeSpecial: [
        'Itchy Ooze Special',
        'ifDamageDealt(dot(2), effect("poison", 1))',
    ],
    /**Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes. */
    jurgenBellyFlop: ['Jurgen Belly Flop', 'deal(min1(30 - damageTaken()))'],
    /**Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn. */
    jurgenStampSnort: ['Jurgen Stamp Snort', 'effect("doubleDamage", 1)'],
    /**Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target. */
    jurgenSitUpon: ['Jurgen Sit Upon', 'deal(strength/2); effect("stun",1)'],
    /**Attack (Attacks for 4) */
    attack4: ['Attack4', 'deal(4)'],
    /**Matcha Mash: Matcha will deal damage equal to ATK. */
    matchaMash: ['Matcha Mash', 'deal(strength)'],
    /**Matcha Madness: Apply poison 3 to ALL characters. */
    matchaMadness: ['Matcha Madness', 'effect("poison", 3, "all")'],
    /**Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha. */
    matchaMeld: ['Matcha Meld', 'TODO'],
    /**Ancient Strike (Deals 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn. */
    ancientStrike: [
        'Ancient Strike',
        'ifDamageDealt(deal(strength * 2), effect("stun", 1))',
    ],
    /**Magic Missile (attacks for 25) */
    hansMagicMissile: ['Hans Magic Missile', 'deal(25)'],
    /**Jab */
    jab: ['Jab', 'deal(strength * .5)'],
    /**Strike */
    strike: ['Strike', 'deal(strength + 2)'],
} as const

// @ts-expect-error // our shorthand doesn't have perfect type inference...
export const commandDefinitionsMap: CommandDefinitionsMap = {
    /**Eviscerating Sweep (Deals 100%, Splash Damage) applies vulnerable (3) */
    evisceratingSweep: {
        name: 'Eviscerating Sweep',
        id: 'evisceratingSweep',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'deal(strength); effect{"vulnerable", 3}',
    },

    /**Blood Moon Curse (all player characters receive fatigue (2), unguarded (2)) */
    hansCurse: {
        name: 'Hans Curse',
        id: 'hansCurse',
        targetNum: -1,
        targetType: 'allEnemies',
        actions:
            'effect("fatigue", 2, "enemies"); effect("unguarded", 2, "enemies")',
    },

    /**Guards!!! (summons up to 2 cultist guards) */
    hansGuards: {
        name: 'Hans Guards',
        id: 'hansGuards',
        targetNum: 0,
        targetType: 'self',
        actions: 'summon("cultistGuard"); summon("cultistGuard")',
    },

    /**Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block. */
    passiveBlock: {
        name: 'Passive Block',
        id: 'passiveBlock',
        targetNum: 0,
        targetType: 'self',
        actions: 'effect("passiveBlock", 20)',
    },

    /**Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn). */
    hansBuffBlock: {
        name: 'Hans Buff Block',
        id: 'hansBuffBlock',
        targetNum: 0,
        targetType: 'self',
        actions: 'effect("smallDamageBonus", 2, "friends")',
    },

    /**Rest (does nothing) */
    rest: {
        name: 'Rest',
        id: 'rest',
        targetNum: 0,
        targetType: 'self',
        actions: 'rest()',
    },

    /**'Block' */
    block: {
        name: 'Block',
        id: 'block',
        targetNum: 1,
        targetType: 'self',
        actions: 'addBlock(dexterity)',
    },

    /**Slash (SL) */
    slash: {
        name: 'Slash',
        id: 'slash',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'deal(strength/2)',
    },
    /**Roll Around (same as Belly Flop, but with Slash damage) */
    jurgenRollAround: {
        name: 'Roll Around',
        id: 'jurgenRollAround',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'deal(strength/2)',
    },
    ...entryMap(singleOpponentTargetCommands, (id, [displayName, actions]) => ({
        actions,
        id,
        name: displayName,
        targetNum: 1,
        targetType: 'enemies',
    })),
}

/**
 * mutates commandDefinitionsMap in place
 */
function generateParameterizedCommands() {
    for (const levelObj of Object.values(enemies))
        for (const enemy of Object.values(levelObj))
            for (const commandId of enemy.moves) {
                if (commandId == null || !commandId.includes('(')) continue
                const baseId = commandId.split('(')[0]
                const args = [...commandId.matchAll(/\d+/g)].map(x =>
                    Number(x[0])
                )
                args.forEach(x => {
                    if (!isFinite(x))
                        throw Error(
                            `command '${commandId}' has non-finite argument '${x}'`
                        )
                })
                if (!(baseId in alias))
                    throw Error(`'${baseId}' is not a known alias`)
                if (baseId in commandDefinitionsMap) continue
                // @ts-expect-error
                const baseCommand = alias[baseId]
                commandDefinitionsMap[commandId] = baseCommand(...args)
            }
}
generateParameterizedCommands()
