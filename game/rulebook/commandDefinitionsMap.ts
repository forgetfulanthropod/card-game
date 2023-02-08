import type {
    ActionName,
    CardAction,
    CommandDefinition,
    CommandId,
    NpcCommandDefinition,
    NpcCommandId,
} from 'shared'
import { entryMap, keys } from 'shared/code'
import * as alias from './commandAliases'
import { getRulebook } from './rulebook'
// TODO eventually: remove ? before : below
type CommandDefinitionsMap = Record<NpcCommandId, NpcCommandDefinition>

/**
 * simple commands which targe one opponent
 * no friendly targets allowed!!!
 **/
const singleOpponentTargetCommands = {
    swordWack: ['Sword Wack', 'deal(strength)'],
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
    /**Belly Flop: Bosshog Jürgen will attempt to attack for 100% damage, but will deal 1 point less for every point of damage he takes. */
    jurgenBellyFlop: ['Belly Flop', 'bellyFlop(strength, 1)'],
    /**Sit Upon: Jürgen sits on one of your characters. This attack does 2/3 of his attack damage and gives debilitated (2) to the target. */
    jurgenSitUpon: ['Sit Upon', 'deal(strength*2/3); effect("debilitated",2)'],
    /**Matcha Mash: Matcha will deal damage equal to ATK. */
    matchaMash: ['Matcha Mash', 'deal(strength)'],
    /**Matcha Madness: Apply poison 3 to ALL characters. */
    matchaMadness: ['Matcha Madness', 'effect("poisoned", 3, "allEnemies")'],
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
    // "Road Closure: At the start of your next turn, draw 2 fewer cards than normal."
    roadClosure: {
        name: 'Road Closure',
        explanation:
            'At the start of your next turn, draw 2 fewer cards than normal.',
        //@ts-expect-error
        id: 'roadClosure',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'drawSizeChange(-2)',
    },
    snowFort: {
        name: 'Snow Fort',
        explanation: 'All enemies receive 100% block',
        //@ts-expect-error
        id: 'snowFort',
        targetNum: -1,
        targetType: 'allFriends',
        actions: 'addBlock(defense)',
    },
    commonCold: {
        name: 'Common Cold',
        explanation: [
            'All targeted Kaiju receive <b>Fatigued</b> (1) and <b>Unguarded</b> (1).',
            'At the start of your next turn, draw 1 fewer card than normal.',
        ],
        //@ts-expect-error
        id: 'commonCold',
        targetNum: -1,
        targetType: 'allEnemies',
        actions:
            'effect("fatigued", 1, "enemies"); effect("unguarded", 1, "enemies"); drawSizeChange(-1)',
    },
    mimicAttack: {
        //@ts-expect-error
        id: 'mimicAttack',
        name: 'Mimic Attack',
        actions: 'mimicAttack()',
        targetNum: 1,
        targetType: 'enemies',
    },
    mimicInfectiousBite: {
        //@ts-expect-error
        id: 'mimicInfectiousBite',
        name: 'Infectious Bite',
        explanation: [
            'Mimic attacks for 100%.',
            'Apply <b>Poisoned</b> equal to the amount of unblocked damage.',
        ],
        actions: 'infectiousBite(strength)',
        targetNum: 1,
        targetType: 'enemies',
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
        targetNum: 1,
        targetType: 'self',
        actions: 'summon("cultistGuard"); summon("cultistGuard")',
    },

    /** Stamp and Snort: Jürgen gets very angry and stamps around in place.  He does nothing this turn but increases his base attack by 25 the following turn. **/
    jurgenStampSnort: {
        name: 'Stamp and Snort',
        //@ts-expect-error
        id: 'jurgenStampSnort',
        targetNum: 1,
        targetType: 'self',
        actions: 'effect("stamp", 2)',
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
        actions: 'bellyFlop(strength / 2, 2)',
    },

    //hogs start

    hypnosis: {
        actions: `chain(deal(strength / 2), effect("debilitated", 1))`,
        //@ts-expect-error
        id: `hypnosis`,
        name: `Hypnosis`,
        targetNum: 1,
        targetType: 'enemies',
    },
    psychicBolt: {
        explanation:
            'Attacks for 50%. Target character receives Unguarded and Fatigued (1)',
        actions: `chain(deal(strength * .5), effect("unguarded", 1), effect("fatigued", 1))`,
        //@ts-expect-error
        id: `psychicBolt`,
        name: `Psychic Bolt`,
        targetNum: 1,
        targetType: 'enemies',
    },
    spiritQuest: {
        explanation: 'All enemies receive Brave (2)',
        actions: `effect("brave", 2, "allFriends")`,
        //@ts-expect-error
        id: `spiritQuest`,
        name: `Spirit Quest`,
        targetNum: -1,
        targetType: 'allFriends',
    },

    snortinTime: {
        actions: `effect("unguarded", 2)`,
        //@ts-expect-error
        id: `snortinTime`,
        explanation: '',
        name: ``,
        targetNum: -1,
        targetType: 'allEnemies',
    },
    tummySlam: {
        actions: `ifDamageDealtApplyEffect(strength * .6, "tired", 2)`,
        //@ts-expect-error
        id: `tummySlam`,
        explanation:
            'Attacks for 60% of Basic Attack twice. If any damage goes unblocked, the targeted character gains Tired (1).',
        name: ``,
        targetNum: 2,
        targetType: 'enemies',
    },
    bigBelly: {
        actions: `chain(addBlock(defense * .5), addBlockToSelf(defense * .5))`,
        //@ts-expect-error
        id: `bigBelly`,
        explanation: 'Applies 50% block to all Enemies.',
        name: ``,
        targetNum: -1,
        targetType: 'allFriends',
    },
    quickNap: {
        actions: `chain(effect("doubleDamage", 2), heal(health * .1))`,
        //@ts-expect-error
        id: `quickNap`,
        explanation:
            'Naps.  Doubles Warhog Raider’s damage the following turn.  Heal Warhog Raider for 10% of its base health.',
        name: ``,
        targetNum: 1,
        targetType: 'self',
    },

    violentSneeze: {
        actions: `chain(deal(strength * .5), effect("vulnerable", 3))`,
        //@ts-expect-error
        id: `violentSneeze`,
        explanation: 'Deals 50% to target character, applies Vulnerable (3)',
        name: ``,
        targetNum: 2,
        targetType: 'enemies',
    },
    surpriseAllergy: {
        actions: `ifDamageDealtApplyEffect(strength * .5, "poisoned", 5)`,
        //@ts-expect-error
        id: `surpriseAllergy`,
        explanation:
            'Deals 50% to target character, applies 5 Poison if damage goes unblocked.',
        name: ``,
        targetNum: 1,
        targetType: 'enemies',
    },
    parasiticNibble: {
        actions: `chain(deal(strength * .75), heal(health * .05))`,
        //@ts-expect-error
        id: `parasiticNibble`,
        explanation: 'Deal 75%.  Heal for 5% of base health.',
        name: ``,
        targetNum: 1,
        targetType: 'enemies',
    },

    //hogs end

    bigBomb1: {
        actions: `""`,
        //@ts-expect-error
        id: `bigBomb1`,
        name: `Big Bomb`,
        targetNum: 1,
        targetType: 'enemies',
    },
    bigBomb2: {
        actions: `deal(strength * 3)`,
        //@ts-expect-error
        id: `bigBomb2`,
        name: `Big Bomb`,
        targetNum: 1,
        targetType: 'enemies',
    },

    /**Bucket of Bang Snaps: Deal 33% three times. Applies Unready (2) if any damage goes unblocked.*/
    bucketOfBangSnaps: {
        actions: `ifDamageDealtApplyEffect(strength * .33, "unready", 2)`,
        //@ts-expect-error
        id: `bucketOfBangSnaps`,
        name: `Bucket of Bang Snaps`,
        targetNum: -1,
        targetType: 'allEnemies',
    },
    /**yodel attacks for 50%.  After this turn, the enemy party will gain Emboldened (2).*/
    yodel: {
        actions: `chain(deal(strength * .5), queue(effect("courageous", 2, "allFriends"), 1))`,
        //@ts-expect-error
        id: `yodel`,
        name: `Bucket of Bang Snaps`,
        targetNum: 1,
        targetType: 'enemies',
    },
    /**Bucket of Bang Snaps*/
    demolitionCharge: {
        actions: `ifDamageDealt(deal(strength), chain(queue(effect("courageous", 1, "self"), 1), effect("tired", 1)))`,
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
        actions: `deal((constitution-health)*0.25)`,
        //@ts-expect-error
        id: `grudge`,
        name: `grudge`,
        targetNum: 1,
        targetType: 'enemies',
    },

    gnomeBomb: {
        actions: `ifDamageDealtApplyEffect(strength * .3, 'tired', 1)`,
        //@ts-expect-error
        id: `gnomeBomb`,
        name: `Gnome Bomb`,
        explanation: 'deal strength',
        targetNum: -1,
        targetType: 'allEnemies',
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
    for (const levelObj of Object.values(getRulebook().npcStatsMapByLevel))
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
                if (`${baseId}(${args})` in commandDefinitionsMap) continue
                // @ts-expect-error
                const baseCommand = alias[baseId]
                commandDefinitionsMap[commandId] = baseCommand(...args)
            }
}
generateParameterizedCommands()
