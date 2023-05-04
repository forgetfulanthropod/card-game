import type { BattleCursor, CharacterMeta, CharacterUid } from 'shared'
import {
    Souvenir,
    SouvenirId,
    SouvenirActivationKey,
} from 'shared/tree/Souvenir'

import { getLivingPcs, getLivingNpcs } from './characters/characterGetters'
import { drawCard } from './cards/drawNewHand'
import { applyStatModifiers } from './cards/commands/modifyStats'
import { healCharacter } from './cards/commands/heal'
import { applyEffect } from './cards/commands/effect'
import { applyBlocks } from './cards/commands/addBlock'
import { randomValue } from '@/characterGeneration/data/util'
import { applyDamage } from './util'

//TODO: put these util functions somewhere else like commands
const getTurnCards = (
    scene: BattleCursor,
    turnCount: number,
    characterUid?: CharacterUid
) => {
    return scene
        .get('cardsPlayedThisRoom')
        .filter(
            card =>
                card.turnCount == turnCount &&
                (!characterUid || card.characterUid == characterUid)
        )
}

export const talentMap: Partial<Record<SouvenirId, Souvenir>> = {
    quickToPickAFight: {
        id: 'quickToPickAFight',
        name: `Quick To Pick A Fight`,
        description:
            'At the start of your turn, if your hand has no attack cards, draw cards until you draw an attack card. (Unique)',
        unique: true,
        equippable: true,
        on: {},
        on2: {
            postDrawHand: ({ scene }) => {
                while (
                    Object.keys(scene.get('cards', 'draw')).length &&
                    !Object.values(scene.get('cards', 'hand')).some(
                        card => card.type === 'attack'
                    )
                ) {
                    logger.info('no attack')
                    drawCard(scene)
                }
            },
        },
    },
    pressurePointSpecialist: {
        id: 'pressurePointSpecialist',
        name: `Pressure Point Specialist`,
        description:
            'The Critical Hit chance of this character is increased by 5%.',
        equippable: true,
        on: {},
        on2: {
            // acquire: ({ scene, souvenir }) => {
            //     if (!souvenir.characterUid) return
            //     const stats = {
            //         critChanceAddend: 0.05,
            //     }
            //     applyStatModifiers({
            //         scene,
            //         uids: [souvenir.characterUid],
            //         stats,
            //         expiration: 'run',
            //     })
            // },
            critChance: ({ data: critChance }) => critChance + 0.05,
        },
    },
    nativeOfHooligansBluff: {
        id: 'nativeOfHooligansBluff',
        name: `Native of Hooligan's Bluff`,
        description: `Increase this character's stats by 5% in Hooligan's Bluff.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!(scene.get('dungeonName') === 'Hooligans Bluff')) return
                if (!souvenir.characterUid) return
                let calculatedStats = scene.select(
                    'allCharacters',
                    souvenir.characterUid,
                    'calculatedStats'
                )
                let hp = calculatedStats.get('constitution')
                const stats = {
                    strengthMultiplicand: 0.05,
                    magicMultiplicand: 0.05,
                    defenseMultiplicand: 0.05,
                    constitutionMultiplicand: 0.05,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
                let hpNew = calculatedStats.get('constitution')
                healCharacter(scene, souvenir.characterUid, hpNew - hp, false)
            },
        },
    },
    excellentCook: {
        id: 'excellentCook',
        name: `Excellent Cook`,
        description: `Rest sites heal your party for 8% more health.`,
        equippable: true,
        on: {},
        on2: {
            enterRestSite: ({ scene }) => {
                for (const cm of getLivingPcs(scene.get())) {
                    healCharacter(scene, cm.uid, 0.08, true)
                }
            },
        },
    },
    fisherman: {
        id: 'fisherman',
        name: `Fisherman`,
        description: `Draw an additional card and heal all party members for 2% of their maximum health at the start of your third turn.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene }) => {
                if (scene.get('turnCount') != 3) return
                drawCard(scene)
                for (const cm of getLivingPcs(scene.get())) {
                    healCharacter(scene, cm.uid, 0.02, true)
                }
            },
        },
    },
    alwaysPackSnacks: {
        id: 'alwaysPackSnacks',
        name: `alwaysPackSnacks`,
        description: `Event rooms heal your party for 3% of their maximum health`,
        equippable: true,
        on: {},
        on2: {
            enterEventSite: ({ scene }) => {
                const healAmount = 0.03
                for (const cm of getLivingPcs(scene.get())) {
                    healCharacter(scene, cm.uid, healAmount, true)
                }
            },
        },
    },
    goodImmuneSystem: {
        id: 'goodImmuneSystem',
        name: `Good Immune System`,
        description: `This character reduces all Poison and Bleed damage by 50%.`,
        equippable: true,
        on: {},
        on2: {
            preEffectDamage: ({ data }) => data * 0.5,
        },
    },
    mildlyLucky: {
        id: 'mildlyLucky',
        name: `Mildly Lucky`,
        description:
            '+2% chance of Critical Hit.  +1% chance of Dodge.  If this character would die, 33% they are reduced to 1 Health instead (can only successfully trigger once per run)',
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    critChanceAddend: 0.02,
                    dodgeChanceAddend: 0.01,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
            // damageGive: (): on2FunctionTypes['damageGive'] => {
            //     return (attacker, target, damage) => damage + 1
            // },
            postDie: ({ scene, souvenir, idx, target }) => {
                if ((souvenir.counter ?? 0) > 0) return
                const roll = Math.random()
                if (roll < 1 / 3) {
                    scene.set(['allCharacters', target.uid, 'health'], 1)
                    scene.apply(
                        ['souvenirs', idx, 'counter'],
                        s => (s ?? 0) + 1
                    )
                }
            },
        },
    },
    experiencedForager: {
        id: 'experiencedForager',
        name: `Experienced Forager`,
        description:
            'All party members heal for 2% of their maximum health after every combat.',
        equippable: true,
        on: {},
        on2: {
            battleEnd: ({ scene }) => {
                for (const cm of getLivingPcs(scene.get())) {
                    healCharacter(scene, cm.uid, 0.02, true)
                }
            },
        },
    },
    bornSurvivor: {
        id: 'bornSurvivor',
        name: `Born Survivor`,
        description:
            'The first time this character would die, reduce their health to 1 instead.',
        equippable: true,
        on: {},
        on2: {
            postDie: ({ scene, souvenir, idx, target }) => {
                if ((souvenir.counter ?? 0) > 0) return
                scene.set(['allCharacters', target.uid, 'health'], 1)
                incrementCounter(scene, idx)
            },
        },
    },
    secretVampire: {
        id: 'secretVampire',
        name: `Secret Vampire`,
        description:
            'Whenever this character plays an attack card that destroys an enemy, they heal for 10% of their maximum health.',
        equippable: true,
        on: {},
        on2: {
            postKill: ({ scene, souvenir, target }) => {
                if (!souvenir.characterUid) return
                if (target.isPc) return
                healCharacter(scene, souvenir.characterUid, 0.1, true)
            },
        },
    },
    marathonRunner: {
        id: 'marathonRunner',
        name: `Marathon Runner`,
        description:
            'After the first 5 combats in a dungeon, increase this characters stats by 10%.',
        equippable: true,
        on: {},
        on2: {
            battleEnd: ({ scene, souvenir, idx }) => {
                souvenir = incrementCounter(scene, idx)
                if (souvenir.counter == 5) {
                    if (!souvenir.characterUid) return
                    let calculatedStats = scene.select(
                        'allCharacters',
                        souvenir.characterUid,
                        'calculatedStats'
                    )
                    let hp = calculatedStats.get('constitution')
                    const stats = {
                        strengthMultiplicand: 0.1,
                        magicMultiplicand: 0.1,
                        defenseMultiplicand: 0.1,
                        constitutionMultiplicand: 0.1,
                    }
                    applyStatModifiers({
                        scene,
                        uids: [souvenir.characterUid],
                        stats,
                        expiration: 'run',
                    })
                    let hpNew = calculatedStats.get('constitution')
                    healCharacter(
                        scene,
                        souvenir.characterUid,
                        hpNew - hp,
                        false
                    )
                }
            },
        },
    },
    bigGameHunter: {
        id: 'bigGameHunter',
        name: `Big Game Hunter`,
        description: 'This character deals 10% more damage against Bosses.',
        equippable: true,
        on: {},
        on2: {
            // TODO: only 10% bonus dmg vs bosses
            damageGiveMultiply: ({ data, scene }) => {
                if (scene.get('currentRoom', 'category') === 'bosses')
                    return data + 0.1
                return data
            },
        },
    },
    bully: {
        id: 'bully',
        name: `Bully`,
        description:
            'Attack cards played by this character deal 5%+1 more damage against enemies with less health than them.',
        equippable: true,
        on: {},
        on2: {
            damageGiveAdd: ({ souvenir, target, attacker, data }) => {
                if (souvenir.characterUid != attacker.uid) return data
                if (!attacker || !target) return data
                return attacker.health > target.health ? data + 1 : data
            },
            damageGiveMultiply: ({ souvenir, target, attacker, data }) => {
                if (souvenir.characterUid != attacker.uid) return data
                if (!attacker || !target) return data
                return attacker.health > target.health ? data + 0.05 : data
            },
        },
    },
    stealthy: {
        id: 'stealthy',
        name: `stealthy`,
        description: `Increase this character's Dodge chance by 4%.  Slightly decrease this character's Taunt (decrease it by -5, hidden)`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    dodgeChanceAddend: 0.04,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
            tauntBase: ({ data }) => {
                return data - 5
            },
        },
    },
    frontLineFighter: {
        id: 'frontLineFighter',
        name: `frontLineFighter`,
        description: `Increase this character's Defense and Strength by +4%.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    defenseMultiplicand: 0.04,
                    strengthMultiplicand: 0.04,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
        },
    },
    levelHeaded: {
        id: 'levelHeaded',
        name: `levelHeaded`,
        description: `Increase this character's Health by +6%.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                let calculatedStats = scene.select(
                    'allCharacters',
                    souvenir.characterUid,
                    'calculatedStats'
                )
                let hp = calculatedStats.get('constitution')
                const stats = {
                    constitutionMultiplicand: 0.06,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
                let hpNew = calculatedStats.get('constitution')
                healCharacter(scene, souvenir.characterUid, hpNew - hp, false)
            },
        },
    },
    greatGuy: {
        id: 'greatGuy',
        name: `greatGuy`,
        description: `Everyone agrees that this Kaiju is extremely nice.`,
        equippable: true,
        on: {},
    },
    ADHD: {
        id: 'ADHD',
        name: `ADHD`,
        description: `Draw an additional card at the beginning of every other turn. If you don't play any cards from this character in a turn, this character gains Fatigue (1) at the start of their next turn.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const turnCount = scene.get('turnCount')
                if (turnCount == 1) return
                if (turnCount % 2 == 0) drawCard(scene)
                const lastTurnCards = getTurnCards(
                    scene,
                    turnCount - 1,
                    souvenir.characterUid
                )
                if (lastTurnCards.length == 0) {
                    applyEffect(
                        scene,
                        [souvenir.characterUid],
                        'tiredDebuff',
                        1
                    )
                }
            },
        },
    },
    veryLoyal: {
        id: 'veryLoyal',
        name: `Very Loyal`,
        description: `The first time this character plays a defense card that targets an ally each turn, their target gains an extra +20% block.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            blockGiveAdd: ({ scene, data, souvenir, cm, idx, target }) => {
                if (!cm) return data
                if ((souvenir.counter ?? 0) > 0) return data
                if (target.uid == souvenir.characterUid) return data
                data += cm.calculatedStats.defense * 0.2
                incrementCounter(scene, idx)
                return data
            },
        },
    },
    pillager: {
        id: 'pillager',
        name: `Pillager`,
        description: `Whenever a character in your party destroys an enemy, all friendly characters gain +15% block.`,
        equippable: true,
        on: {},
        on2: {
            postKillGeneral: ({ scene, souvenir, target }) => {
                if (!souvenir.characterUid) return
                if (target.isPc) return
                const cm = scene.get('allCharacters', souvenir.characterUid)
                const block = 0.15 * cm.calculatedStats.defense
                const targetUids = getLivingPcs(scene.get()).map(cm => cm.uid)
                applyBlocks({ scene, block, fromUid: null, targetUids })
            },
        },
    },
    giantSlayer: {
        id: 'giantSlayer',
        name: `Giant Slayer`,
        description: `+15% Critical Hit chance vs Bosses.  The first attack card this character targets a boss with per combat automatically crits.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            critChance: ({ scene, souvenir, idx, data: critChance }) => {
                if (scene.get('currentRoom', 'category') != 'bosses')
                    return critChance
                if ((souvenir.counter ?? 0) > 0) return critChance + 1
                incrementCounter(scene, idx)
                return critChance + 0.15
            },
        },
    },
    eternalOptimist: {
        id: 'eternalOptimist',
        name: `Eternal Optimist`,
        description: `This character starts all Boss Fights and Elite encounters with Courageous (3).`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                if (scene.get('currentRoom', 'category') == 'bosses')
                    applyEffect(
                        scene,
                        [souvenir.characterUid],
                        'courageousBuff',
                        3
                    )
            },
        },
    },
    emotionallySensitive: {
        id: 'emotionallySensitive',
        name: `Emotionally Sensitive`,
        description: `This character's Magic and Strength are increased by 8%+1.  Their Defense and Health are decreased by 4%.  Critical hits by this character deal an additional +25% damage.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir, idx }) => {
                souvenir = incrementCounter(scene, idx)
                if (!souvenir.characterUid) return
                const stats = {
                    strengthMultiplicand: 0.08,
                    magicMultiplicand: 0.08,
                    defenseMultiplicand: -0.04,
                    constitutionMultiplicand: -0.04,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
            critDamageMultiply({ data }) {
                return data + 0.25
            },
        },
    },
    distinctiveRibbit: {
        id: 'distinctiveRibbit',
        name: `Distinctive Ribbit`,
        description: `Increase the critical hit chance of allies by 3%.`,
        equippable: true,
        on: {},
        on2: {
            critChanceGeneral: ({ souvenir, data: critChance, attacker }) => {
                if (attacker.uid == souvenir.characterUid) return critChance
                return critChance + 0.03
            },
        },
    },
    slipperyWhenWet: {
        id: 'slipperyWhenWet',
        name: `slipperyWhenWet`,
        description: `If this character ends their turn with 0 block, they gain +20% block.`,
        equippable: true,
        on: {},
        on2: {
            turnEnd: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const cm = scene.get('allCharacters', souvenir.characterUid)
                if (cm.block == 0) {
                    const block = cm.calculatedStats.defense * 0.2
                    applyBlocks({
                        fromUid: null,
                        targetUids: [cm.uid],
                        scene,
                        block,
                    })
                }
            },
        },
    },
    poisonousBlood: {
        id: 'poisonousBlood',
        name: `Poisonous Blood`,
        description: `If this character is attacked by an enemy while they have Bleed, apply Poison (20%) to the attacker.`,
        equippable: true,
        on: {},
        on2: {
            damageReceive: ({ scene, cm, target, attacker, data: damage }) => {
                if (
                    cm &&
                    cm.effects.find(
                        effect =>
                            effect.id === 'bleedDebuff' && effect.counter > 0
                    ) != undefined
                ) {
                    applyEffect(
                        scene,
                        [attacker.uid],
                        'poisonedDebuff',
                        cm.calculatedStats.magic * 0.2
                    )
                }
                return damage
            },
        },
    },
    stickyHands: {
        id: 'stickyHands',
        name: `Sticky Hands`,
        description: `Randomly keep one card in your hand at the end of your turn. (Unqiue)`,
        unique: true,
        equippable: true,
        on: {},
        on2: {
            preDiscardAtTurnEnd({ scene, data: keep, piles }) {
                const hand = Object.values(piles.hand)
                const card = randomValue(hand)
                if (card) keep.push(card.uid)
                return keep
            },
        },
    },
    wiseCroaker: {
        id: 'wiseCroaker',
        name: `Wise Croaker`,
        description: `If you don't play any cards from this Kaiju in a turn, draw an additional card and this Kaiju gains Strongblock (1) at the beginning of your next turn.`,
        equippable: true,
        on: {},
        on2: {
            turnStart({ scene, souvenir }) {
                if (!souvenir.characterUid) return
                const turnCount = scene.get('turnCount')
                if (turnCount == 1) return
                const lastTurnCards = getTurnCards(
                    scene,
                    turnCount - 1,
                    souvenir.characterUid
                )
                if (lastTurnCards.length == 0) {
                    drawCard(scene)
                    applyEffect(
                        scene,
                        [souvenir.characterUid],
                        'strongblockBuff',
                        1
                    )
                }
            },
        },
    },
    excellentStompDancer: {
        id: 'excellentStompDancer',
        name: `Excellent Stomp Dancer`,
        description: `This Warhog's War Stomp card deals an additional 25% damage.`,
        equippable: true,
        on: {},
        on2: {
            damageGiveMultiply: ({ souvenir, data, attacker, cardId }) => {
                if (souvenir.characterUid != attacker.uid) return data
                if (cardId != 'warStomp') return data
                return data + 0.25
            },
        },
    },
    thickBoned: {
        id: 'thickBoned',
        name: `Thick Boned`,
        description: `Whenever you draw a card for this character, they gain +6% block.`,
        equippable: true,
        on: {},
        on2: {
            drawCard: ({ scene, souvenir, card }) => {
                if (souvenir.characterUid == card.characterUid) {
                    const block =
                        scene.get(
                            'allCharacters',
                            souvenir.characterUid,
                            'calculatedStats'
                        ).defense * 0.06
                    applyBlocks({
                        scene,
                        block,
                        fromUid: null,
                        targetUids: [souvenir.characterUid],
                    })
                }
            },
        },
    },
    shortTempered: {
        id: 'shortTempered',
        name: `Short Tempered`,
        description: `This character starts every room with Berserk (1) and Resistant (1).`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                applyEffect(scene, [souvenir.characterUid], 'berserkBuff', 1)
                applyEffect(scene, [souvenir.characterUid], 'guardedBuff', 1)
            },
        },
    },
    ironSkinned: {
        id: 'ironSkinned',
        name: `Iron Skinned`,
        description: `This character is immune to Poison damage and Bleed.`,
        equippable: true,
        on: {},
        on2: {
            preEffectDamage: ({ souvenir, target, data, damageType }) => {
                if (souvenir.characterUid != target.uid) return data
                if (damageType == 'poison' || damageType == 'bleed') return 0
                return data
            },
        },
    },
    bigYawn: {
        id: 'bigYawn',
        name: `Big Yarn`,
        description: `The first Defense card this character plays per room applies Tired (1) to all enemies.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            playCard: ({ scene, souvenir, idx, card }) => {
                if (souvenir.characterUid != card.characterUid) return
                if ((souvenir.counter ?? 0) > 0) return
                if (card.type === 'defense') {
                    incrementCounter(scene, idx)
                    const npcs = getLivingNpcs(scene.get()).map(npc => npc.uid)
                    applyEffect(scene, npcs, 'tiredDebuff', 1)
                }
            },
        },
    },
    apexOmnivore: {
        id: 'apexOmnivore',
        name: `Apex Omnivore`,
        description: `Critical Hits from this character have Piercing.`,
        equippable: true,
        on: {},
        on2: {
            piercingCheck: ({
                attacker,
                souvenir,
                data: piercing,
                isCritical,
            }) => {
                if (souvenir.characterUid != attacker.uid) return piercing
                if (isCritical) return true
                return piercing
            },
        },
    },
    veryLarge: {
        id: 'veryLarge',
        name: `Very Large`,
        description: `The Health of this character is increased by 7.5%.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                let calculatedStats = scene.select(
                    'allCharacters',
                    souvenir.characterUid,
                    'calculatedStats'
                )
                let hp = calculatedStats.get('constitution')
                const stats = {
                    constitutionMultiplicand: 0.075,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
                let hpNew = calculatedStats.get('constitution')
                healCharacter(scene, souvenir.characterUid, hpNew - hp, false)
            },
        },
    },
    veryVeryLarge: {
        id: 'veryVeryLarge',
        name: `Very, Very, Large`,
        description: `The Health of this character is increased by 15%.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                let calculatedStats = scene.select(
                    'allCharacters',
                    souvenir.characterUid,
                    'calculatedStats'
                )
                let hp = calculatedStats.get('constitution')
                const stats = {
                    constitutionMultiplicand: 0.15,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
                let hpNew = calculatedStats.get('constitution')
                healCharacter(scene, souvenir.characterUid, hpNew - hp, false)
            },
        },
    },
    reinforcedHooves: {
        id: 'reinforcedHooves',
        name: `Reinforced Hooves`,
        description: `The Strength of this character is increased by 10%.`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    strengthMultiplicand: 0.1,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
        },
    },
    bigNapper: {
        id: 'bigNapper',
        name: `Big Napper`,
        description: `If you don't play any cards from this Kaiju in a turn, this Kaiju heals for 6% of their maximum health.`,
        equippable: true,
        on: {},
        on2: {
            turnEnd: ({ scene, souvenir, cm }) => {
                if (!souvenir.characterUid) return
                const turnCount = scene.get('turnCount')
                const lastTurnCards = getTurnCards(
                    scene,
                    turnCount,
                    souvenir.characterUid
                )
                if (lastTurnCards.length == 0) {
                    healCharacter(scene, souvenir.characterUid, 0.06, true)
                }
            },
        },
    },
    disarminglyCute: {
        id: 'disarminglyCute',
        name: `Disarmingly Cute`,
        description: `Every time this character plays an Attack Card, 20% chance of applying Fatigue (1) to enemies targeted.`,
        equippable: true,
        on: {},
        on2: {
            playCard: ({ scene, souvenir, idx, card, targetUids }) => {
                if (souvenir.characterUid != card.characterUid) return
                if (card.type !== 'attack') return
                // for (const targetUid of targetUids) {
                //     const target = scene.get('allCharacters', targetUid)
                //     if (!target || target.health <= 0) return
                const roll = Math.random()
                if (roll < 0.2) {
                    applyEffect(scene, targetUids, 'tiredDebuff', 1)
                }
            },
        },
    },
    anxietyRiddled: {
        id: 'anxietyRiddled',
        name: `Anxiety Riddled`,
        description: `The first time this character discards a card per room, draw 1.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            discardCard: ({ scene, souvenir, idx }) => {
                if ((souvenir.counter ?? 0) > 0) return
                incrementCounter(scene, idx)
                drawCard(scene)
            },
        },
    },
    extraBlubbery: {
        id: 'extraBlubbery',
        name: `Extra Blubbery`,
        description: `Whenever this character plays a card, they gain 10% block.`,
        equippable: true,
        on: {},
        on2: {
            playCard: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const character = scene.get(
                    'allCharacters',
                    souvenir.characterUid
                )
                const block = character.calculatedStats.defense * 0.1
                applyBlocks({
                    scene,
                    block,
                    fromUid: null,
                    targetUids: [souvenir.characterUid],
                })
            },
        },
    },
    headEmpty: {
        id: 'headEmpty',
        name: `Head Empty`,
        description: `If you don't play any cards from this character in a turn, they gain +100% block.`,
        equippable: true,
        on: {},
        on2: {
            turnEnd: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const turnCount = scene.get('turnCount')
                const lastTurnCards = getTurnCards(
                    scene,
                    turnCount,
                    souvenir.characterUid
                )
                if (lastTurnCards.length == 0) {
                    const character = scene.get(
                        'allCharacters',
                        souvenir.characterUid
                    )
                    const block = character.calculatedStats.defense
                    applyBlocks({
                        scene,
                        block,
                        fromUid: null,
                        targetUids: [souvenir.characterUid],
                    })
                }
            },
        },
    },
    doingTheirBest: {
        id: 'doingTheirBest',
        name: `Doing Their Best`,
        description: `If you play 3 cards owned by this character in one turn, remove all debuffs from this Kaiju.  They gain +50% block.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            playCard: ({ scene, card, souvenir, idx }) => {
                if (souvenir.characterUid != card.characterUid) return
                souvenir = incrementCounter(scene, idx)
                if (!souvenir.characterUid) return
                if (souvenir.counter == 3) {
                    const character = scene.get(
                        'allCharacters',
                        souvenir.characterUid
                    )
                    const block = character.calculatedStats.defense * 0.5
                    applyBlocks({
                        scene,
                        block,
                        fromUid: null,
                        targetUids: [souvenir.characterUid],
                    })
                }
            },
        },
    },
    accidentProne: {
        id: 'accidentProne',
        name: `AccidentProne`,
        description: `Whenever a card from this character with Brittle breaks, apply Bleed (1) to all enemies.`,
        equippable: true,
        on: {},
        on2: {
            brittleBreak: ({ scene, souvenir, card }) => {
                if (!card) return
                if (souvenir.characterUid != card.characterUid) return
                const npcs = getLivingNpcs(scene.get()).map(npc => npc.uid)
                applyEffect(scene, npcs, 'bleedDebuff', 1)
            },
        },
    },
    peppy: {
        id: 'peppy',
        name: `Peppy`,
        description: `The first time per room this character plays 3 cards in 1 turn, gain 1 energy.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            turnStart: ({ scene, souvenir, idx }) => {
                if (souvenir.counter == -1) return
                setCounter(scene, idx, 0)
            },
            playCard: ({ scene, souvenir, idx, card }) => {
                if ((souvenir.counter ?? 0) == -1) return
                if (souvenir.characterUid != card.characterUid) return
                souvenir = incrementCounter(scene, idx)
                if (souvenir.counter == 3) {
                    setCounter(scene, idx, -1)
                    scene.apply('energy', e => e + 1)
                }
            },
        },
    },
    partyBouncer: {
        id: 'partyBouncer',
        name: `Party Bouncer`,
        description: `Whenever this character plays a card with Redirect, they gain +15% block and Courageous (1).`,
        equippable: true,
        on: {},
    },
    townMilitiaMember: {
        id: 'townMilitiaMember',
        name: `Town Militia Member`,
        description: `This character's Basic Attack deals an additional +25%.`,
        equippable: true,
        on: {},
        on2: {
            damageGiveMultiply: ({ scene, souvenir, cardId, data }) => {
                if (!cardId) return data
                const card = scene.get('cards', 'hand', cardId)
                if (souvenir.characterUid != card.characterUid) return data
                if (card.id.startsWith('basicAttack')) return data + 0.25
                return data
            },
        },
    },
    barbarian: {
        id: 'barbarian',
        name: `Barbarian`,
        description: `Increase this character's Strength by 8%. Increase the damage bonus Berserk gives this character by 10%`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    strengthMultiplicand: 0.08,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
            damageGiveMultiply: ({ cm, data }) => {
                if (
                    cm &&
                    cm.effects.find(
                        effect =>
                            effect.id === 'berserkBuff' && effect.counter > 0
                    ) != undefined
                ) {
                    return data + 0.1
                }
                return data
            },
        },
    },
    veteranPitFighter: {
        id: 'veteranPitFighter',
        name: `Veternal Pit Fighter`,
        description: `The first attack card this character plays per room costs 1 less energy.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            playCardPre: ({ scene, souvenir, idx, data: card }) => {
                if ((souvenir.counter ?? 0) > 0) return card
                if (card.type != 'attack') return card
                incrementCounter(scene, idx)
                card.energy = Math.max(card.energy - 1, 0)
                return card
            },
        },
    },
    royalGuard: {
        id: 'royalGuard',
        name: `Royal Guard`,
        description: `Increase the amount of block generated by Defense cards this character plays that target allies by 15%.`,
        equippable: true,
        on: {},
        on2: {
            blockGiveMultiply: ({ souvenir, data, cm, target }) => {
                if (!cm) return data
                if (cm.uid != souvenir.characterUid) return data
                if (target.uid == souvenir.characterUid) return data
                return data + 0.15
            },
        },
    },
    shieldProficiency: {
        id: 'shieldProficiency',
        name: `Shield Proficiency`,
        description: `Increase the amount of block generated by Defense cards this character plays by 10%.`,
        equippable: true,
        on: {},
        on2: {
            blockGiveMultiply: ({ souvenir, data, cm, target }) => {
                if (!cm) return data
                if (cm.uid != souvenir.characterUid) return data
                return data + 0.1
            },
        },
    },
    intimidating: {
        id: 'intimidating',
        name: `Intimidating`,
        description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Tired (2).`,
        equippable: true,
        on: {},
        on2: {
            postKill: ({ scene, cm, souvenir }) => {
                if (!cm || souvenir.characterUid != cm.uid) return
                const npcs = getLivingNpcs(scene.get()).map(npc => npc.uid)
                applyEffect(scene, npcs, 'tiredDebuff', 2)
            },
        },
    },
    terrifying: {
        id: 'terrifying',
        name: `Terrifying`,
        description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Fatigue (1).`,
        equippable: true,
        on: {},
        on2: {
            postKill: ({ scene, cm, souvenir }) => {
                if (!cm || souvenir.characterUid != cm.uid) return
                const npcs = getLivingNpcs(scene.get()).map(npc => npc.uid)
                applyEffect(scene, npcs, 'fatiguedDebuff', 1)
            },
        },
    },
    attritionFighter: {
        id: 'attritionFighter',
        name: `Attrition Fighter`,
        description: `After your third turn, increase this character's Strength, Defense and Magic by 18% until the end of the room.`,
        equippable: true,
        on: {},
        on2: {
            turnEnd: ({ scene, souvenir, idx }) => {
                souvenir = incrementCounter(scene, idx)
                if (!souvenir.characterUid) return
                if (souvenir.counter == 3) {
                    const stats = {
                        strengthMultiplicand: 0.18,
                        magicMultiplicand: 0.18,
                        defenseMultiplicand: 0.18,
                    }
                    applyStatModifiers({
                        scene,
                        uids: [souvenir.characterUid],
                        stats,
                        expiration: 'run',
                    })
                }
            },
        },
    },
    nobleGuardian: {
        id: 'nobleGuardian',
        name: `Noble Guardian`,
        description: `This character gives all other characters +15% block during the first turn of every room.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const cm = scene.get('allCharacters', souvenir.characterUid)
                if (!cm) return
                const players = cm.isPc
                    ? getLivingPcs(scene.get())
                    : getLivingNpcs(scene.get())
                const playerUids = players
                    .map(p => p.uid)
                    .filter(uid => uid != souvenir.characterUid)
                const block = cm.calculatedStats.defense * 0.15
                applyBlocks({
                    fromUid: souvenir.characterUid,
                    targetUids: playerUids,
                    scene,
                    block,
                })
            },
        },
    },
    conduitOfChaosMagic: {
        id: 'conduitOfChaosMagic',
        name: `Conduit Of Chaos Magic`,
        description: `15% chance to gain +1 energy at the start of each turn.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene }) => {
                const roll = Math.random()
                if (roll < 0.15) {
                    scene.apply('energy', e => e + 1)
                }
            },
        },
    },
    privyToAnAncientandTerribleSecret: {
        id: 'privyToAnAncientandTerribleSecret',
        name: `Privy To Ancient and Terrible Secret`,
        description: `Every time you draw a card, there is a 10% chance that cards cost will be reduced by 1 (triggers a maximum of once per room).  The Magic of this character is increased by 10%.  The Health of this character is decreased by 10%.  This character starts each room with Tired (1).`,
        equippable: true,
        on: {},
        on2: {
            acquire: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const stats = {
                    magicMultiplicand: 0.1,
                    constitutionMultiplicand: -0.1,
                }
                applyStatModifiers({
                    scene,
                    uids: [souvenir.characterUid],
                    stats,
                    expiration: 'run',
                })
            },
            battleStart: ({ scene, souvenir, idx }) => {
                setCounter(scene, idx, 0)
                if (!souvenir.characterUid) return
                applyEffect(scene, [souvenir.characterUid], 'tiredDebuff', 1)
            },
            // TODO: implement
            drawCard: ({ scene, card, souvenir }) => {
                return
            },
        },
    },
    legendaryFireMage: {
        id: 'legendaryFireMage',
        name: `Legendary Fire Mage`,
        description: `All Attack Cards this character plays have Fire Damage.`,
        equippable: true,
        on: {},
        on2: {
            // TODO put with a different hook
            damageGiveAdd: ({ scene, souvenir, data, attacker, target }) => {
                if (souvenir.characterUid != attacker.uid) return data
                if (!target) return data
                applyEffect(scene, [target.uid], 'fireDebuff', 1)
                return data
            },
        },
    },
    masterOracle: {
        id: 'masterOracle',
        name: `Master Oracle`,
        description: `Draw an additional card at the start of each turn. (Unique)`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene }) => {
                drawCard(scene)
            },
        },
    },
    aspiringSeer: {
        id: 'aspiringSeer',
        name: `Aspiring Seer`,
        description: `Draw an additional card at the start of your first turn.  (Unique)`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene }) => {
                drawCard(scene)
            },
        },
    },
    forgetfulGenius: {
        id: 'forgetfulGenius',
        name: `Forgetful Genius`,
        description: `Every time you draw a card, 10% chance to draw an additional card.`,
        equippable: true,
        on: {},
        on2: {
            drawCard: ({ scene }) => {
                const roll = Math.random()
                if (roll < 0.1) drawCard(scene)
            },
        },
    },
    starChartExpert: {
        id: 'starChartExpert',
        name: `Star Chart Expert`,
        description: `Whenever an Attack, Defense, Utility, and Enchantment card are played in the same turn, deal 50% to all enemies.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            playCard: ({ scene, souvenir, idx }) => {
                if (!souvenir.characterUid) return
                if ((souvenir.counter ?? 0) > 0) return
                // TODO use a state for the souvenir or counter attribute instead of calculating all on every card play
                let hasTypes = {
                    attack: false,
                    defense: false,
                    utility: false,
                    enchantment: false,
                }
                const turnCount = scene.get('turnCount')
                const turnCards = getTurnCards(scene, turnCount)
                turnCards.forEach(card => {
                    hasTypes[card.type] = true
                })
                if (Object.values(hasTypes).every(t => t == true)) {
                    incrementCounter(scene, idx)
                    const character = scene.get(
                        'allCharacters',
                        souvenir.characterUid
                    )
                    const damage = character.calculatedStats.magic * 0.5
                    getLivingNpcs(scene.get())
                        .map(npc => npc.uid)
                        .forEach(targetUid => {
                            applyDamage({
                                scene,
                                damage,
                                targetUid,
                                damageType: 'normal',
                            })
                        })
                }
            },
        },
    },
    tormentedByWhispers: {
        id: 'tormentedByWhispers',
        name: `Tormented by Whispers`,
        description: `When a card with Momentary is played, deal 10% damage to a random enemy. `,
        equippable: true,
        on: {},
        on2: {
            momentaryAfter: ({ scene, souvenir, card }) => {
                if (!souvenir.characterUid) return
                const npc = randomValue(getLivingNpcs(scene.get()))
                if (!npc) return
                const character = scene.get(
                    'allCharacters',
                    souvenir.characterUid
                )
                const damage = character.calculatedStats.magic * 0.1
                applyDamage({
                    scene,
                    damage,
                    targetUid: npc.uid,
                    attackerUid: character.uid,
                    damageType: 'normal',
                })
                return
            },
        },
    },
    photographicMemory: {
        id: 'photographicMemory',
        name: `Photographic Memory`,
        description: `Whenever a card with Momentary is played, it has a 20% chance to be added to the discard pile instead of being removed for the room. `,
        equippable: true,
        on: {},
        on2: {
            momentaryInterrupt: ({ data: interrupt }) => {
                const roll = Math.random()
                return roll < 0.2 ? true : interrupt
            },
        },
    },
    dirtyDealer: {
        id: 'dirtyDealer',
        name: `Dirty Dealer`,
        description: `Every time a character destroys an enemy, draw a card.`,
        equippable: true,
        on: {},
        on2: {
            postKillGeneral: ({ scene }) => {
                drawCard(scene)
            },
        },
    },
    masterLooter: {
        id: 'masterLooter',
        name: `Master Looter`,
        description: `After the first combat of a run, draft an additional card. (Unique)`,
        unique: true,
        equippable: true,
        on: {},
        on2: {
            lootItems: ({ scene, souvenir, idx, data: shuffledLootItems }) => {
                if ((souvenir.counter ?? 0) > 0) return shuffledLootItems
                incrementCounter(scene, idx)
                shuffledLootItems.unshift({ name: 'draftCard', count: 1 })
                return shuffledLootItems
            },
        },
    },
    thrifty: {
        id: 'thrifty',
        name: `Thrifty`,
        description: `The first time you discard a card per room, draw a card.`,
        equippable: true,
        on: {},
        on2: {
            battleStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            discardCard: ({ scene, souvenir, idx, card }) => {
                if ((souvenir.counter ?? 0) > 0) return
                incrementCounter(scene, idx)
                drawCard(scene)
            },
        },
    },
    invigoratedbyBloodshed: {
        id: 'invigoratedbyBloodshed',
        name: `Invigorated by Bloodshed`,
        description: `Whenever an enemy is destroyed, this character gains Courageous (1) and Guarded (1).`,
        equippable: true,
        on: {},
        on2: {
            postKillGeneral: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                applyEffect(scene, [souvenir.characterUid], 'courageousBuff', 1)
                applyEffect(scene, [souvenir.characterUid], 'guardedBuff', 1)
            },
        },
    },
    scrappyandVicious: {
        id: 'scrappyandVicious',
        name: `Scrappy and Vicious`,
        description: `If you play 3 or more attack cards in a single turn, increase this character's strength by 33% until the end of the turn.`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, idx }) => {
                setCounter(scene, idx, 0)
            },
            playCard: ({ scene, souvenir, idx, card }) => {
                if (card.type === 'attack') {
                    souvenir = incrementCounter(scene, idx)
                }
                if (!souvenir.characterUid) return
                if (souvenir.counter == 3) {
                    const stats = {
                        strengthMultiplicand: 0.33,
                    }
                    applyStatModifiers({
                        scene,
                        uids: [souvenir.characterUid],
                        stats,
                        expiration: 'room',
                    })
                }
            },
        },
    },
    collectorOfContraband: {
        id: 'collectorOfContraband',
        name: `Collector of Contraband`,
        description: `At the start of your second turn, decrease the cost of a random card in your hand to 0.`,
        equippable: true,
        on: {},
    },
    arterialArtisan: {
        id: 'arterialArtisan',
        name: `Arterial Artisan`,
        description: `As long as this character is alive, enemies lose an addtional 5% max health from bleed stacks. (Unique)`,
        equippable: true,
        on: {},
        on2: {
            bleedMultiply: ({
                scene,
                data: bleedMultiplicand,
                souvenir,
                target,
            }) => {
                if (!souvenir.characterUid) return bleedMultiplicand
                const character = scene.get(
                    'allCharacters',
                    souvenir.characterUid
                )
                if (character.isPc != target.isPc) {
                    return bleedMultiplicand + 0.05
                }
                return bleedMultiplicand
            },
        },
    },
    oneWithTheShadows: {
        id: 'oneWithTheShadows',
        name: `One with The Shadowd`,
        description: `Slightly decrease this character's Taunt at the start of each turn. (Decrease it by 3).`,
        equippable: true,
        on: {},
        on2: {
            turnStart: ({ scene, souvenir }) => {
                if (!souvenir.characterUid) return
                const characterCursor = scene.select(
                    'allCharacters',
                    souvenir.characterUid
                )
                characterCursor.apply('taunt', t => t - 3)
                characterCursor.apply(['calculatedStats', 'taunt'], t => t - 3)
            },
        },
    },
}

export const filterTalents = (
    scene: BattleCursor,
    activationKey: SouvenirActivationKey,
    cm?: CharacterMeta,
    notLiving?: boolean
) => {
    if (scene.get('id') != 'battle') return []
    const livingPcs = getLivingPcs(scene.get()).map(cm => cm.uid)
    const talents = scene
        .get('souvenirs')
        .map((souvenir, idx) => [souvenir, idx])
        .filter(([souvenir, idx]) => {
            souvenir = souvenir as Souvenir
            return (
                souvenir.characterUid &&
                (notLiving || livingPcs.includes(souvenir.characterUid)) &&
                (!cm || souvenir.characterUid == cm.uid) &&
                talentMap[souvenir.id]?.on2?.[activationKey]
            )
        })
    return talents as [Souvenir, number][]
}

const incrementCounter = (scene: BattleCursor, idx: number) => {
    scene.apply(['souvenirs', idx, 'counter'], count => (count ? count + 1 : 1))
    return scene.get('souvenirs', idx)
}

const setCounter = (scene: BattleCursor, idx: number, value: number) => {
    scene.apply(['souvenirs', idx, 'counter'], count => value)
    return scene.get('souvenirs', idx)
}

export const activateTalent = (
    souvenir: Souvenir,
    key: SouvenirActivationKey,
    scene: BattleCursor,
    idx: number,
    extra?: any
) => {
    if (!extra) extra = {}
    let func
    // TODO make default implementations of intermediate value changing functions
    if ((func = talentMap[souvenir.id]?.on2?.[key]))
        return func({ scene, souvenir, idx, ...extra })
    return undefined
}

export const activateTalents = ({
    scene,
    key,
    cm,
    notLiving,
    extra,
}: {
    scene: BattleCursor
    key: SouvenirActivationKey
    cm?: CharacterMeta
    notLiving?: boolean
    extra?: any
}) => {
    filterTalents(scene, key, cm, notLiving).forEach(([souvenir, idx]) => {
        activateTalent(souvenir, key, scene, idx, extra)
    })
}

export const activateTalentsData = <Type>(args: {
    scene: BattleCursor
    key: SouvenirActivationKey
    data: Type
    cm?: CharacterMeta
    notLiving?: boolean
    extra?: any
}): Type => {
    let { scene, key, data, cm, notLiving, extra } = args
    if (!extra) extra = {}
    filterTalents(scene, key, cm, notLiving).forEach(([souvenir, idx]) => {
        const tmp = activateTalent(souvenir, key, scene, idx, {
            data,
            cm,
            ...extra,
        })
        //@ts-expect-error
        if (tmp !== undefined) data = tmp
    })
    return data
}

export const activateTalentsMap: Partial<Record<SouvenirActivationKey, any>> = {
    battleStart: activateTalents,
    battleEnd: activateTalents,
    critChance: activateTalentsData,
    turnStart: activateTalents,
    enterRestSite: activateTalents,
    damageGiveAdd: activateTalentsData,
    damageGiveMultiply: activateTalentsData,
    damageReceiveAdd: activateTalentsData,
    damageReceiveMultiply: activateTalentsData,
    lethalDamageInterrupt: activateTalents,
    postDie: activateTalents,
    postKill: activateTalents,
    postDrawHand: activateTalents,
    preEffectDamage: activateTalentsData,
    taunt: activateTalentsData,
}
