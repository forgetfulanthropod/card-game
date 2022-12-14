import type {
    ActionName,
    CardAction,
    CommandDefinition,
    CommandId,
    NpcCommandDefinition,
    NpcCommandId,
} from 'shared'
import { entryMap, keys } from 'shared/code'
import { npcStatsMapByLevel } from './npcStatsMapByLevel'
import * as alias from './commandAliases'
// TODO eventually: remove ? before : below
type CommandDefinitionsMap = Record<NpcCommandId, NpcCommandDefinition>

/**
 * simple commands which targe one opponent
 * no friendly targets allowed!!!
 **/
const singleOpponentTargetCommands = {
    swordWack: ['Sword Wack', 'deal(strength)'],
    /** Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deal the same amount of damage back to the player).*/
    mimicAttack: ['Mimic Attack', 'mimicAttack'],
    /**Rusty Poke (DOT 2, also applies Fatigue 1) */
    rustyPokeHigh: ['Rusty Poke High', 'deal(strength); effect("fatigued", 1)'],
    /**Rusty Poke (DOT 2) */
    rustyPokeLow: ['Rusty Poke Low', 'deal(strength)'],
    /**Basic Attack */
    basicAttack: ['Basic Attack', 'deal(strength)'],
    /**Chomp (BA) */
    chomp: ['Chomp', 'deal(strength)'],
    /**Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.) */
    itchyOozeSpecial: [
        'Itchy Ooze Special',
        'ifDamageDealt(dot(2), effect("poisoned", 1))',
    ],
    /**Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes. */
    jurgenBellyFlop: ['Jurgen Belly Flop', 'deal(min1(30 - damageTaken()))'],
    /**Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn. */
    jurgenStampSnort: ['Jurgen Stamp Snort', 'effect("doubleDamage", 1)'],
    /**Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target. */
    jurgenSitUpon: ['Jurgen Sit Upon', 'deal(strength/2); effect("stunned",1)'],
    /**Matcha Mash: Matcha will deal damage equal to ATK. */
    matchaMash: ['Matcha Mash', 'deal(strength)'],
    /**Matcha Madness: Apply poison 3 to ALL characters. */
    matchaMadness: ['Matcha Madness', 'effect("poison", 3, "all")'],
    /**Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha. */
    matchaMeld: ['Matcha Meld', 'TODO'],
    /**Ancient Strike (deal 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn. */
    ancientStrike: [
        'Ancient Strike',
        'ifDamageDealt(deal(strength * 2), effect("stunned", 1))',
    ],
    /**Magic Missile (attacks for 25) */
    hansMagicMissile: ['Hans Magic Missile', 'deal(25)'],
    /**Jab */
    jab: ['Jab', 'deal(strength * .5)'],
    /**Strike */
    strike: ['Strike', 'deal(strength + 2)'],
}

export const commandDefinitionsMap: CommandDefinitionsMap = {
    /**Eviscerating Sweep (deal 100%, Splash Damage) applies vulnerable (3) */
    evisceratingSweep: {
        name: 'Eviscerating Sweep',
        //@ts-expect-error
        id: 'evisceratingSweep',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'chain(deal(strength), effect("vulnerable", 3))',
    },

    /**Blood Moon Curse (all player characters receive fatigue (2), unguarded (2)) */
    hansCurse: {
        name: 'Hans Curse',
        //@ts-expect-error
        id: 'hansCurse',
        targetNum: -1,
        targetType: 'allEnemies',
        actions:
            'effect("fatigued", 2, "enemies"); effect("unguarded", 2, "enemies")',
    },

    /**Guards!!! (summons up to 2 cultist guards) */
    hansGuards: {
        name: 'Hans Guards',
        //@ts-expect-error
        id: 'hansGuards',
        targetNum: 0,
        targetType: 'self',
        actions: 'summon("cultistGuard"); summon("cultistGuard")',
    },

    /**Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block. */
    passiveBlockCmd: {
        name: 'Passive Block',
        //@ts-expect-error
        id: 'passiveBlockCmd',
        targetNum: 0,
        targetType: 'self',
        actions: 'effect("passiveBlock", 20)',
    },

    /**Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn). */
    hansBuffBlock: {
        name: 'Hans Buff Block',
        //@ts-expect-error
        id: 'hansBuffBlock',
        targetNum: 0,
        targetType: 'self',
        actions: 'effect("smallDamageIncrease", 2, "friends")',
    },

    /**Rest (does nothing) */
    rest: {
        name: 'Rest',
        //@ts-expect-error
        id: 'rest',
        targetNum: 0,
        targetType: 'self',
        actions: 'rest()',
    },

    /**'Block' */
    block: {
        name: 'Block',
        //@ts-expect-error
        id: 'block',
        targetNum: 1,
        targetType: 'self',
        actions: 'addBlock(defense)',
    },

    /**Slash (SL) */
    slash: {
        name: 'Slash',
        //@ts-expect-error
        id: 'slash',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'deal(strength/2)',
    },
    /**Roll Around (same as Belly Flop, but with Slash damage) */
    jurgenRollAround: {
        name: 'Roll Around',
        //@ts-expect-error
        id: 'jurgenRollAround',
        targetNum: 2,
        targetType: 'enemies',
        actions: 'deal(strength/2)',
    },

    /**Bucket of Bang Snaps: Deal 33% three times. Applies Unready (2) if any damage goes unblocked.*/
    bucketOfBangSnaps: {
        actions: `ifDamageDealt(deal(strength * .2), effect("unready", 2))`,
        //@ts-expect-error
        id: `bucketOfBangSnaps`,
        name: `Bucket of Bang Snaps`,
        targetNum: -1,
        targetType: 'allEnemies',
    },
    /**yodel attacks for 50%.  After this turn, the enemy party will gain Emboldened (2).*/
    yodel: {
        actions: `chain(deal(strength * .5), effect("courageous", 2, "allFriends"))`,
        //@ts-expect-error
        id: `yodel`,
        name: `Bucket of Bang Snaps`,
        targetNum: 1,
        targetType: 'enemies',
    },
    /**Bucket of Bang Snaps*/
    demolitionCharge: {
        actions: `ifDamageDealt(deal(strength), chain(effect("courageous", 2, "self"), effect("tired", 1)))`,
        //@ts-expect-error
        id: `demolitionCharge`,
        name: `Demolition Charge`,
        targetNum: 1,
        targetType: 'enemies',
    },
    /**Fire Cracker*/
    fireCracker: {
        actions: `chain(deal(strength * 1.2), effect("unguarded", 2))`,
        //@ts-expect-error
        id: `fireCracker`,
        name: `Fire Cracker`,
        targetNum: 1,
        targetType: 'enemies',
    },
    grudge: {
        actions: `chain(deal(strength * 1.1), effect("unguarded", 2))`,
        //@ts-expect-error
        id: `grudge`,
        name: `Fire Cracker`,
        targetNum: 1,
        targetType: 'allEnemies',
    },

    gnomeBomb: {
        actions: `deal(strength)`,
        //@ts-expect-error
        id: `gnomeBomb`,
        name: `Gnome Bomb`,
        targetNum: 1,
        targetType: 'enemies',
    },

    ...(() => {
        const singleTargetDefinitions: Partial<
            Record<NpcCommandId, CommandDefinition>
        > = {}

        keys(singleOpponentTargetCommands).forEach(commandId => {
            const command = singleOpponentTargetCommands[commandId]
            singleTargetDefinitions[commandId] = {
                id: commandId,
                name: command[0],
                actions: command[1],
                targetNum: 1,
                targetType: 'enemies',
            }
        })

        return singleTargetDefinitions
    })(),
}

/**
 * mutates commandDefinitionsMap in place
 */
function generateParameterizedCommands() {
    for (const levelObj of Object.values(npcStatsMapByLevel))
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
