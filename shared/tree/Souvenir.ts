import { BattleCursor, Piles, Card, CardUid } from '..'
import {
    BasicTargetType,
    CardAction,
    CharacterMeta,
    CharacterUid,
} from './battle'

export type SouvenirMap = Record<SouvenirId, Souvenir>

export type SouvenirId =
    | 'bigStinkyTooth'
    | 'brokenCarriageWheel'
    | 'bundleOfFrogWine'
    | 'clownInfestation'
    | 'cowardsCrown'
    | 'demonsLeftHand'
    | 'demonsRightHand'
    | 'dentistryForDummies'
    | 'frogWine'
    | 'glassOfWarmMilk'
    | 'nightmareBiscuit'
    | 'squeakyClownShoes'
    // new below
    | 'yummyRice'
    | 'advilPM'
    | 'allPurposeKnob'
    // | 'beanInAJar'
    | 'bigSniff'
    | 'bootlegExplosive'
    | 'concreteShoes'
    | 'contaminatedRag'
    | 'dearestDiary'
    | 'demonCookie'
    | 'dietaryYogurt'
    | 'emptyDiaper'
    | 'enchantedSnowball'
    | 'familyBeetle'
    | 'filledDiaper'
    | 'gamerBathwater'
    | 'lacedBathSalts'
    | 'lavenderTea'
    | 'lilFella'
    // | 'lilTaste'
    // | 'mommysCreditCard'
    | 'organicBathSalts'
    | 'penguinEgg'
    | 'petRock'
    | 'pulledRug'
    | 'questionableHat'
    | 'restrainingOrder'
    | 'rustedGear'
    | 'grandmasHandbag'
    | 'shinyMarble'
    | 'silkGloves'
    | 'squireEmblem'
    | 'stinkEgg'
    | 'stinkyMeat'
    | 'stinkySandwich'
    | 'strangeHat'
    | 'woolBandana'
    // talents
    | 'hypochondriac'
    | 'healthyEater'
    | 'gymRat'
    | 'sorcerer'
    | 'thickSkinned'
    | 'aboveAverageMetabolism'
    | 'worksOutOccasionally'
    | 'magicallyInclined'
    | 'tougherThanMost'
    | 'lovesCamping'
    | 'anxiousAvoidant'
    | 'oftenSleepy'
    | 'amateurCardCounter'
    | 'goodAtPlanning'
    | 'quickToPickAFight'
    | 'pressurePointSpecialist'
    | 'nativeOfHooligansBluff'
    | 'excellentCook'
    | 'fisherman'
    | 'alwaysPackSnacks'
    | 'goodImmuneSystem'
    | 'mildlyLucky'
    | 'experiencedForager'
    | 'bornSurvivor'
    | 'secretVampire'
    | 'marathonRunner'
    | 'bigGameHunter'
    | 'bully'
    | 'stealthy'
    | 'frontLineFighter'
    | 'levelHeaded'
    | 'greatGuy'
    | 'ADHD'
    | 'veryLoyal'
    //
    | 'pillager'
    | 'giantSlayer'
    | 'eternalOptimist'
    | 'emotionallySensitive'
    | 'distinctiveRibbit'
    | 'slipperyWhenWet'
    | 'poisonousBlood'
    | 'stickyHands'
    | 'wiseCroaker'
    | 'excellentStompDancer'
    | 'thickBoned'
    | 'shortTempered'
    | 'ironSkinned'
    | 'bigYawn'
    | 'apexOmnivore'
    | 'veryLarge'
    | 'veryVeryLarge'
    | 'reinforcedHooves'
    | 'bigNapper'
    | 'disarminglyCute'
    | 'anxietyRiddled'
    | 'extraBlubbery'
    | 'headEmpty'
    | 'doingTheirBest'
    | 'accidentProne'
    | 'peppy'
    | 'partyBouncer'
    | 'townMilitiaMember'
    | 'barbarian'
    | 'veteranPitFighter'
    | 'royalGuard'
    | 'shieldProficiency'
    | 'intimidating'
    | 'terrifying'
    | 'attritionFighter'
    | 'nobleGuardian'
    | 'conduitOfChaosMagic'
    | 'privyToAnAncientandTerribleSecret'
    | 'legendaryFireMage'
    | 'masterOracle'
    | 'aspiringSeer'
    | 'forgetfulGenius'
    | 'starChartExpert'
    | 'tormentedByWhispers'
    | 'photographicMemory'
    | 'dirtyDealer'
    | 'masterLooter'
    | 'thrifty'
    | 'invigoratedbyBloodshed'
    | 'scrappyandVicious'
    | 'collectorOfContraband'
    | 'arterialArtisan'
    | 'oneWithTheShadows'

export type SouvenirActivationKey =
    | 'acquire'
    | 'battleStart'
    | 'battleEnd'
    | 'turnStart'
    | 'turnEnd'
    | 'enterEventSite'
    | 'enterRestSite'
    | 'lethalDamageInterrupt'
    | 'takeDamage'
    | 'dealDamage'
    | 'playCard'
    | 'activate'
    | 'discardEnd'
    | 'drawCard'
    | 'shuffleDiscard'
    | 'postDrawHand'
    | 'damageGive'
    | 'damageGiveAdd'
    | 'damageGiveMultiply'
    | 'damageReceive'
    | 'damageReceiveAdd'
    | 'damageReceiveMultiply'
    | 'preEffectDamage'
    | 'postDie'
    | 'postKill'
    | 'postKillGeneral'
    | 'postKillGeneral'
    | 'critChance'
    | 'critChanceGeneral'
    | 'critDamageAdd'
    | 'critDamageMultiply'
    | 'taunt'
    | 'blockGiveAdd'
    | 'blockGiveMultiply'
    | 'blockReceiveAdd'
    | 'blockReceiveMultiply'
    | 'preDiscardAtTurnEnd'

type defaultArgs = {
    scene: BattleCursor
    souvenir: Souvenir
    idx: number
    cm?: CharacterMeta
}

type defaultArgsNumber = defaultArgs & {
    data: number
}

export interface on2FunctionTypes {
    acquire: (args: defaultArgs) => void
    battleStart: (args: defaultArgs) => void
    battleEnd: (args: defaultArgs) => void
    blockGiveAdd: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    blockGiveMultiply: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    blockReceiveAdd: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    blockReceiveMultiply: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    critChance: (
        args: defaultArgs & {
            critChance: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    critChanceGeneral: (
        args: defaultArgs & {
            critChance: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    critDamageAdd: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    critDamageMultiply: (
        args: defaultArgsNumber & { target: CharacterMeta }
    ) => number
    taunt: (args: defaultArgsNumber) => number
    turnStart: (args: defaultArgs) => void
    turnEnd: (args: defaultArgs) => void
    enterEventSite: (args: defaultArgs) => void
    enterRestSite: (args: defaultArgs) => void
    lethalDamageInterrupt: () => void
    takeDamage: () => void
    dealDamage: () => void
    playCard: () => void
    postDie: (args: defaultArgs & { target: CharacterMeta }) => void
    postKill: (args: defaultArgs & { target: CharacterMeta }) => void
    postKillGeneral: (args: defaultArgs & { target: CharacterMeta }) => void
    activate: () => void
    discardEnd: () => void
    drawCard: (args: defaultArgs & { card: Card }) => void
    shuffleDiscard: () => void
    preDiscardAtTurnEnd: (
        args: defaultArgs & { data: CardUid[]; piles: Piles }
    ) => CardUid[]
    preEffectDamage: (
        args: defaultArgs & { data: number; target: CharacterMeta }
    ) => number
    postDrawHand: (args: defaultArgs) => void
    damageGive: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    damageGiveAdd: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    damageGiveMultiply: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    damageReceive: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    damageReceiveAdd: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
    damageReceiveMultiply: (
        args: defaultArgs & {
            data: number
            target: CharacterMeta
            attacker: CharacterMeta
            cardId?: CardUid
        }
    ) => number
}

export type Souvenir = {
    id: SouvenirId
    name: string
    equippable: boolean
    description: string
    characterUid?: CharacterUid
    targetNum?: number
    targetType?: BasicTargetType
    counter?: number
    usedUp?: boolean
    unique?: boolean
    on: Partial<Record<SouvenirActivationKey, CardAction>>
    on2?: Partial<on2FunctionTypes>
    // {
    //     acquire?: CardAction
    //     battleStart?: CardAction
    //     battleEnd?: CardAction
    //     turnStart?: CardAction
    //     turnEnd?: CardAction
    // }
}

export const souvenirMap: Record<SouvenirId, Souvenir> = {
    bigStinkyTooth: {
        id: 'bigStinkyTooth',
        name: 'Big Stinky Tooth',
        equippable: true,
        description: 'Equipped Kaiju gains +6 DEF,-2 STR, and -2 MAG.',
        on: {
            acquire: 'modifyStats("defense|strength|magic", "6|-2|-2", "run")',
        },
    },
    dentistryForDummies: {
        id: 'dentistryForDummies',
        name: 'Dentistry for Dummies',
        equippable: true,
        description: 'Equipped Kaiju gains +1 MAG after completing each room.',
        on: {
            battleEnd: 'modifyStats("magic", "1", "run")',
        },
    },
    frogWine: {
        id: 'frogWine',
        name: 'Frog Wine',
        equippable: false,
        description: 'All Kaiju gain +1 STR, +1 MAG, and +1 DEF.',
        on: {
            acquire: 'modifyStats("strength|magic|defense", "1|1|1", "run")',
        },
    },
    brokenCarriageWheel: {
        id: 'brokenCarriageWheel',
        name: 'Broken Carriage Wheel',
        equippable: true,
        description:
            'Equipped Kaiju takes 2 damage and gains 2 STR on equip.<br/>At the start of each room, apply Berserk (5) to equpped Kaiju.',
        on: {
            acquire: 'deal(2); modifyStats("strength", "2", "run")',
            battleStart: 'effect("berserk", 5)',
        },
    },
    bundleOfFrogWine: {
        id: 'bundleOfFrogWine',
        name: 'Bundle of Frog Wine',
        equippable: false,
        description:
            'All Kaiju take 10 Damage.All Kaiju gain +2 STR, +2 MAG, and +2 DEF.',
        on: {
            acquire: `deal(10); modifyStats("strength|magic|defense", "2|2|2", "run")`,
        },
    },
    squeakyClownShoes: {
        id: 'squeakyClownShoes',
        name: 'Squeaky Clown Shoes',
        equippable: true,
        description:
            'Aggressive Stance no longer gives this Kaiju damage modifiers.',
        on: {
            // battleStart: 'effectPermanent("ignoreAggressive")',
            turnStart: 'effect("ignoreAggressive", 1)',
        },
    },
    cowardsCrown: {
        id: 'cowardsCrown',
        name: 'Cowards Crown',
        equippable: false,
        description: 'All Kaiju deal 15% more damage in avoidant stance',
        on: {
            turnStart: 'effect("cowardsCrown", 1)',
        },
    },
    clownInfestation: {
        id: 'clownInfestation',
        name: 'Infestation of Clowns',
        equippable: false,
        description:
            'At the start of a new Encounter, apply Unguarded (1) to all friendly characters.  Apply Vulnerable (2) to all enemy characters. ',
        on: {
            battleStart:
                'chain(effect("unguarded", 1, "allFriends"), effect("vulnerable", 2, "allEnemies"))',
        },
    },
    demonsLeftHand: {
        id: 'demonsLeftHand',
        name: "Demon's Left Hand",
        equippable: true,
        description: 'Equipped Kaiju gets+2 STR, +2 MAG, and-12 max Health',
        on: {
            acquire:
                'modifyStats("strength|magic|constitution", "2|2|-12", "run")',
        },
    },
    demonsRightHand: {
        id: 'demonsRightHand',
        name: "Demon's Right Hand",
        equippable: true,
        description: 'Equipped Kaiju gets+35 max Health, -1 STR,and -1 MAG',
        on: {
            acquire: `chain(
                    modifyStats("strength|magic|constitution", "-1|-1|35", "run"),
                    heal(30)
                )`,
        },
    },
    nightmareBiscuit: {
        id: 'nightmareBiscuit',
        name: 'Nightmare Biscuit',
        equippable: true,
        description:
            'Equipped Kaiju gains +3 STR, +3 MAG, and a permanent stack of Unguarded.',
        on: {
            acquire: 'modifyStats("strength|magic", "3|3", "run")',
            turnStart: 'effect("unguarded", 1)',
        },
    },
    glassOfWarmMilk: {
        id: 'glassOfWarmMilk',
        name: 'Glass of Warm Milk',
        equippable: false,
        description: 'Heal all Kaiju for 12.',
        on: {
            acquire: 'heal(12)',
        },
    },
    yummyRice: {
        id: 'yummyRice',
        name: 'Yummy Rice',
        description:
            'Heal all party members for 8. In addition, characters heal for an additional 8 HP whenever you enter a rest site.',
        equippable: false,
        on: {
            acquire: 'heal(8)',
            enterRestSite: 'heal(8)',
        },
    },
    // beanInAJar: {
    //     id: 'beanInAJar',
    //     name: `Bean in a Jar`,
    //     description: `Start encounters with a random Melody In play. `,
    //     equippable: false,
    //     on: {
    //     },
    // },
    familyBeetle: {
        id: 'familyBeetle',
        name: `Family Beetle`,
        description: `Equipped Kaiju gains Brave (1) if they start their turn in avoidant stance.`,
        equippable: true,
        on: {
            turnStart: 'ifStance("avoidant", effect("brave", 1))',
        },
    },
    dietaryYogurt: {
        id: 'dietaryYogurt',
        name: `Dietary Yogurt`,
        description: `All party members start encounters with 9 block`,
        equippable: false,
        on: {
            battleStart: 'addBlock(9)',
        },
    },
    emptyDiaper: {
        id: 'emptyDiaper',
        name: `Empty Diaper`,
        description: `The next time equipped Kaiju would take lethal damage, ignore that damage, and replace this item with Filled Daiper.`,
        equippable: true,
        on: {
            lethalDamageInterrupt: `removeSouvenir("emptyDiaper"); acquireSouvenir("filledDiaper")`,
        },
    },
    filledDiaper: {
        id: 'filledDiaper',
        name: `Filled Diaper`,
        description: `Equipped Kaiju Has -20 Constitution, -2 STR, and -2 MAG.`,
        equippable: true,
        on: {
            acquire:
                'modifyStats("constitution|strength|magic", "-20|-2|-2", "run")',
        },
    },
    lilFella: {
        id: 'lilFella',
        name: `Funny lil Fella`,
        description: `Whenever a friendly Kaiju takes unblocked damage, draw a card, then discard a card.`,
        equippable: false,
        on: {
            takeDamage: 'queue(1, chain(draw(1), discard(1)))',
        },
    },
    // lilTaste: {
    //     id: 'lilTaste',
    //     name: `Lil' Taste`,
    //     description: `Consecutive attacks against the same enemy deal an additional 10% damage`,
    //     equippable: false,
    //     on: {
    //         turnStart: 'effect("lilTaste", 1)',
    //     },
    // },
    // mommysCreditCard: {
    //     id: 'mommysCreditCard',
    //     name: `Mommy's Credit Card`,
    //     description: `Your next shop Purchase is free. Remove this item after purchase is made.`,
    //     equippable: false,
    //     on: {
    //     },
    // },
    pulledRug: {
        id: 'pulledRug',
        name: `Pulled Rug`,
        description: `Upon obtaining Pulled Rug, deal 7 damage to the character it's equipped to.  That character gains +3 DEF and starts every encounter with 7 block.
        If a character equipped with this souvenir ends their turn in Neutral Stance, they take 2 damage and gain Brave (1)`,
        equippable: true,
        on: {
            acquire: 'deal(7); modifyStats("defense", "3", "run")',
            battleStart: 'addBlock(7)',
            turnEnd: `
                ifStance(
                    "neutral",
                    chain(
                        deal(2),
                        modifyStats("defense", "3", "run")
                    )
                )
            `,
        },
    },
    questionableHat: {
        id: 'questionableHat',
        name: `Questionable Hat`,
        description: `Draw two less cards at the start of each turn.  Gain an additional energy at the start of each turn`,
        equippable: false,
        on: {
            turnStart: `addEnergy(1); drawSizeChange(-2)`,
        },
    },
    restrainingOrder: {
        id: 'restrainingOrder',
        name: `Restraining Order`,
        description: `Bosses and tier four enemies deal 10% less damage`,
        equippable: false,
        on: {
            turnStart: `if(
                    currentRoomCategory === "tierFour" || currentRoomCategory === "boss",
                    effect("restrainingOrder", 1, "allEnemies")
                )`,
        },
    },
    stinkEgg: {
        id: 'stinkEgg',
        name: `Stink Egg`,
        description: `Set Equipped Kaiju's stance to avoident after you end your turn.`,
        equippable: true,
        on: {
            turnEnd: 'setStance("avoidant")',
        },
    },
    stinkyMeat: {
        id: 'stinkyMeat',
        name: `Stinky Meat`,
        description: `Equipped Kaiju's attacks apply poisoned 2.`,
        equippable: true,
        on: {
            playCard: `if(lastCardPlayedType === "attack", effect("poisoned", 2))`,
        },
    },
    strangeHat: {
        id: 'strangeHat',
        name: `Strange Hat`,
        description: `Equipped Kaiju gains +3 DEF.`,
        equippable: true,
        on: {
            acquire: 'modifyStats("defense", "3", "run")',
        },
    },
    squireEmblem: {
        id: 'squireEmblem',
        name: `Squire Emblem`,
        description: `Whenever equipped kaiju plays a card, they gain 4 block.`,
        equippable: true,
        on: {
            playCard: 'if(wasLastCardPlayedFromThisCharacter, addBlock(4))',
        },
    },
    woolBandana: {
        id: 'woolBandana',
        name: `Wool Bandana`,
        description: `Whenever equipped Kaiju ends its turn in a new stance, it gains 1 Orb of Lightning`,
        equippable: true,
        on: {
            turnEnd: 'ifStanceElse(turnStartStance, null, orb("lightning", 1))',
        },
    },
    contaminatedRag: {
        id: 'contaminatedRag',
        name: `Contaminated Rag`,
        description: `Equipped Kaiju is immune to Poison Damage`,
        equippable: true,
        on: {
            turnStart: 'effect("immuneToPoison", 1)',
        },
    },
    rustedGear: {
        id: 'rustedGear',
        name: `Rusted Gear`,
        description: `If you've played an attack card this turn, all utility cards cost 1 less.`,
        equippable: false,
        on: {
            playCard:
                'if(lastCardPlayedType === "attack", discountCardsOfType("utility", 1))',
        },
    },
    enchantedSnowball: {
        id: 'enchantedSnowball',
        name: `Enchanted Snowball`,
        description: `Whenever equipped Kaiju ends their turn in the same stance they started their turn in, they gains 1 Orb of Frost`,
        equippable: false,
        on: {
            turnEnd: 'ifStance(turnStartStance, orb("frost", 1))',
        },
    },
    lavenderTea: {
        id: 'lavenderTea',
        name: `Lavender Tea`,
        description: `Set equipped Kaiju's stance to neutral after you end your turn.`,
        equippable: true,
        on: {
            turnEnd: 'setStance("neutral")',
        },
    },
    petRock: {
        id: 'petRock',
        name: `Pet Rock`,
        description: `Equipped Kaiju gains 1 block whenever a card is played.`,
        equippable: true,
        on: {
            playCard: 'addBlock(1)',
        },
    },
    penguinEgg: {
        id: 'penguinEgg',
        name: `Penguin Egg`,
        description: `Yummy`,
        equippable: false,
        on: {
            acquire: 'heal(2)',
        },
    },
    bootlegExplosive: {
        id: 'bootlegExplosive',
        name: `Bootleg Explosive`,
        description: `Gain a charge when you play a utility card, When you play 3 attacks in 1 turn deal damage to all enemies equal to the number of charges on Bootleg Explosive, then remove all charges. Charges are retained between encounters`,
        equippable: false,
        on: {
            playCard: `
                if(lastCardPlayedType === "utility", souvenirCounter("bootlegExplosiveCharge", 1));
                if(lastCardPlayedType === "attack", souvenirCounter("bootlegAttackStack", 1))
            `,
        },
    },
    dearestDiary: {
        id: 'dearestDiary',
        name: `Dearest Diary`,
        description: `Gain Sticky 1 (Keep up to X cards in your hand that don't get discarded at the end of your turn)`,
        equippable: false,
        on: {
            turnEnd: 'keep(1)',
        },
    },
    shinyMarble: {
        id: 'shinyMarble',
        name: `Shiny Marble`,
        description: `Deal 5 damage to a random enemy at the start of your turn.`,
        equippable: false,
        targetNum: 1,
        targetType: 'enemies',
        on: {
            turnStart: `deal(5)`,
        },
    },
    silkGloves: {
        id: 'silkGloves',
        name: `Silk Gloves`,
        description: `Equipped Kaiju gains +2 MAG until end of turn whenever you play a card.`,
        equippable: true,
        on: {
            playCard: 'modifyStats("magic", "2", "turn")',
        },
    },
    allPurposeKnob: {
        id: 'allPurposeKnob',
        name: `All Purpose Knob.`,
        description: `Activate this object to finish a room without gaining room rewards, and go to next room. (clickable!) Remove after use.`,
        equippable: false,
        on: {
            activate: `openMap(); removeSouvenir("allPurposeKnob")`,
        },
    },
    advilPM: {
        id: 'advilPM',
        name: `Advil PM`,
        description: `Enemy Kaiju start encounters with Tired 2`,
        equippable: false,
        on: {
            battleStart: 'effect("tired", 2, "allEnemies")',
        },
    },
    gamerBathwater: {
        id: 'gamerBathwater',
        name: `Gamer Bathwater`,
        description: `Activate to deal 25 damage to all enemies. (clickable!)This souvenir is destroyed after use. `,
        equippable: false,
        on: {
            activate: `deal(25, null, "allEnemies"); removeSouvenir("gamerBathwater")`,
        },
    },
    demonCookie: {
        id: 'demonCookie',
        name: `Demon Cookie`,
        description: `Equipped Kaiju gains +5 STR and -5 DEF`,
        equippable: true,
        on: {
            acquire: `modifyStats("strength|defense", "5|-5", "run")`,
        },
    },
    grandmasHandbag: {
        id: 'grandmasHandbag',
        name: `Grandma's Handbag`,
        description: `Draw +1 card at the start of every turn.`,
        equippable: false,
        on: {
            turnStart: `drawSizeChange(1)`,
        },
    },
    stinkySandwich: {
        id: 'stinkySandwich',
        name: `Stinky Sandwich`,
        description: `Whenever equipped Kaiju takes damage from an attack, they get +2 DEF until the end of the room.`,
        equippable: true,
        on: {
            takeDamage: `modifyStats("defense", "1", "room")`,
        },
    },
    bigSniff: {
        id: 'bigSniff',
        name: `Big Sniff`,
        description: `At the start of a new encounter, apply vulnerable 1 to a random enemy.`,
        equippable: false,
        targetNum: 1,
        targetType: 'enemies',
        on: {
            battleStart: `effect("vulnerable", 1)`,
        },
    },
    organicBathSalts: {
        id: 'organicBathSalts',
        name: `Organic Bath Salts`,
        description: `Equipped Kaiju takes 2 less damage from attacks.`,
        equippable: true,
        on: {
            battleStart: `effect("damageTakeSubtractorBuff", 1)`,
            turnStart: `effect("damageTakeSubtractorBuff", 1)`,
        },
    },
    lacedBathSalts: {
        id: 'lacedBathSalts',
        name: `Laced Bath Salts`,
        description: `Equipped Kaiju takes 2 extra damage from all attacks.  It gains a permanent stack of Brave.`,
        equippable: true,
        on: {
            battleStart: `effect("damageTakeAddendDebuff", 1)`,
            turnStart: `effect("damageTakeAddendDebuff", 1); effect("brave", 1)`,
        },
    },
    concreteShoes: {
        id: 'concreteShoes',
        name: `Concrete Shoes`,
        description: `Equipped Kaiju gets +8 DEF and +35 max health but can't change stances outside of cards and abilities that force them to do so.`,
        equippable: true,
        on: {
            acquire: `modifyStats("defense", "5", "run"); modifyStats("constitution", "35", "run")`,
            turnStart: `effect("lockStance", 1)`,
        },
    },
    hypochondriac: {
        id: 'hypochondriac',
        name: 'Hypochondriac',
        description:
            'This character ignores the first debuff applied to them per room.',
        equippable: true,
        on: {
            battleStart: `effect("hypochondriac", 1)`,
        },
    },
    healthyEater: {
        id: 'healthyEater',
        name: `Healthy Eater`,
        description: `The Health of this character is increased by 8%+1.`,
        equippable: true,
        on: {
            acquire: `chain(modifyStats("constitution|constitutionMultiplicand", "1|0.08", "run"), heal(targetConstitution*0.08+1))`,
        },
    },
    gymRat: {
        id: 'gymRat',
        name: `Gym Rat`,
        description: `The Strength of this character is increased by 8%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("strength|strengthMultiplicand", "1|0.08", "run")`,
        },
    },
    sorcerer: {
        id: 'sorcerer',
        name: `Sorcerer`,
        description: `The Magic of this character is increased by 8%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("magic|magicMultiplicand", "1|0.08", "run")`,
        },
    },
    thickSkinned: {
        id: 'thickSkinned',
        name: `Thick Skinned`,
        description: `The Defense of this character is increased by 8%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("defense|defenseMultiplicand", "1|0.08", "run")`,
        },
    },
    aboveAverageMetabolism: {
        id: 'aboveAverageMetabolism',
        name: `Above Average Metabolism`,
        description: `The Health of this character is increased by 3%+1.`,
        equippable: true,
        on: {
            acquire: `chain(modifyStats("constitution|constitutionMultiplicand", "1|0.03", "run"), heal(targetConstitution*0.03+1))`,
        },
    },
    worksOutOccasionally: {
        id: 'worksOutOccasionally',
        name: `Works Out Occasionally`,
        description: `The Strength of this character is increased by 3%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("strength|strengthMultiplicand", "1|0.03", "run")`,
        },
    },
    magicallyInclined: {
        id: 'magicallyInclined',
        name: `Magically Inclined`,
        description: `The Magic of this character is increased by 3%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("magic|magicMultiplicand", "1|0.03", "run")`,
        },
    },
    tougherThanMost: {
        id: 'tougherThanMost',
        name: `Tougher Than Most`,
        description: `The Defense of this character is increased by 3%+1.`,
        equippable: true,
        on: {
            acquire: `modifyStats("defense|defenseMultiplicand", "1|0.03", "run")`,
        },
    },
    lovesCamping: {
        id: 'lovesCamping',
        name: `Loves Camping`,
        description:
            'Whenever you enter a rest site, this character heals for 25% of their maximum health.',
        equippable: true,
        on: {
            enterRestSite: 'heal(0.25*constitution)',
        },
    },
    anxiousAvoidant: {
        id: 'anxiousAvoidant',
        name: `Anxious Avoidant`,
        description:
            'Whenever this character plays a card that discards a card, 25% chance of draw 1.',
        equippable: true,
        on: {
            discardEnd: 'chance(0.25, draw(1))',
        },
    },
    oftenSleepy: {
        id: 'oftenSleepy',
        name: `Often Sleepy`,
        description:
            'This character starts the first 5 combat rooms with Tired (1).  After the first 5 combat rooms, this character starts all combat rooms with Guarded (1).  Whenever you enter a rest site, this character heals for 15% of their maximum health.',
        equippable: true,
        on: {
            battleStart:
                'incrementSouvenir(idx); if(counter < 5, effect("tired", 1), effect("guarded", 1))',
            enterRestSite: 'heal(0.15*constitution)',
        },
    },
    amateurCardCounter: {
        id: 'amateurCardCounter',
        name: `Amateur Card Counter`,
        description:
            'Whenever you shuffle your discard pile back into your draw pile, draw 1.',
        equippable: true,
        on: {
            shuffleDiscard: 'draw(1)',
        },
    },
    goodAtPlanning: {
        id: 'goodAtPlanning',
        name: `Good at Planning`,
        description:
            'Draw an additional card during the first turn of every combat.',
        equippable: true,
        on: {
            battleStart: 'draw(1)',
        },
    },
    quickToPickAFight: {
        id: 'quickToPickAFight',
        name: `Quick To Pick A Fight`,
        description:
            'At the start of your turn, if your hand has no attack cards, draw cards until you draw an attack card. (Unique)',
        unique: true,
        equippable: true,
        // implemented in talent map
        on: {},
    },
    pressurePointSpecialist: {
        id: 'pressurePointSpecialist',
        name: `Pressure Point Specialist`,
        description:
            'The Critical Hit chance of this character is increased by 5%.',
        equippable: true,
        // implemented in talent map
        on: {},
    },
    nativeOfHooligansBluff: {
        id: 'nativeOfHooligansBluff',
        name: `Native Of Hooligan's Bluff`,
        description: `Increase this character's stats by 5% in Hooligan's Bluff.`,
        equippable: true,
        on: {},
    },
    excellentCook: {
        id: 'excellentCook',
        name: `Excellent Cook`,
        description: `Rest sites heal your party for 8% more health.`,
        equippable: true,
        on: {},
    },
    fisherman: {
        id: 'fisherman',
        name: `Fisherman`,
        description: `Draw an additional card and heal all party members for 2% of their maximum health at the start of your third turn.`,
        equippable: true,
        on: {},
    },
    alwaysPackSnacks: {
        id: 'alwaysPackSnacks',
        name: `Always Pack Snacks`,
        description: `Event rooms heal your party for 3% of their maximum health`,
        equippable: true,
        on: {},
    },
    goodImmuneSystem: {
        id: 'goodImmuneSystem',
        name: `Good Immune System`,
        description: '',
        equippable: true,
        on: {},
    },
    mildlyLucky: {
        id: 'mildlyLucky',
        name: `Mildly Lucky`,
        description: `+2% chance of Critical Hit.  +1% chance of Dodge.  If this character would die, 33% they are reduced to 1 Health instead (can only successfully trigger once per run)`,
        equippable: true,
        on: {},
    },
    experiencedForager: {
        id: 'experiencedForager',
        name: `Experienced Forager`,
        description: `All party members heal for 2% of their maximum health after every combat.`,
        equippable: true,
        on: {},
    },
    bornSurvivor: {
        id: 'bornSurvivor',
        name: `Born Survivor`,
        description:
            'The first time this character would die, reduce their health to 1 instead.',
        equippable: true,
        on: {},
    },
    secretVampire: {
        id: 'secretVampire',
        name: `Secret Vampire`,
        description:
            'Whenever this character plays an attack card that destroys an enemy, they heal for 10% of their maximum health.',
        equippable: true,
        on: {},
    },
    marathonRunner: {
        id: 'marathonRunner',
        name: `Marathon Runner`,
        description:
            'After the first 5 combats in a dungeon, increase this characters stats by 10%.',
        equippable: true,
        on: {},
    },
    bully: {
        id: 'bully',
        name: `Bully`,
        description:
            'Attack cards played by this character deal 5%+1 more damage against enemies with less health than them.',
        equippable: true,
        on: {},
    },
    bigGameHunter: {
        id: 'bigGameHunter',
        name: `Big Game Hunter`,
        description: 'This character deals 10% more damage against Bosses.',
        equippable: true,
        // implemented in talent map
        on: {},
    },
    stealthy: {
        id: 'stealthy',
        name: `stealthy`,
        description: `Increase this character's Dodge chance by 4%.  Slightly decrease this character's Taunt (decrease it by -5, hidden)`,
        equippable: true,
        on: {},
    },
    frontLineFighter: {
        id: 'frontLineFighter',
        name: `frontLineFighter`,
        description: `Increase this character's Defense and Strength by +4%.`,
        equippable: true,
        on: {},
    },
    levelHeaded: {
        id: 'levelHeaded',
        name: `levelHeaded`,
        description: `Increase this character's Health by +6%.`,
        equippable: true,
        on: {},
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
    },
    veryLoyal: {
        id: 'veryLoyal',
        name: `Very Loyal`,
        description: `The first time this character plays a defense card that targets an ally each turn, their target gains an extra +20% block.`,
        equippable: true,
        on: {},
    },
    pillager: {
        id: 'pillager',
        name: `Pillager`,
        description: `Whenever a character in your party destroys an enemy, all friendly characters gain +15% block.`,
        equippable: true,
        on: {},
    },
    giantSlayer: {
        id: 'giantSlayer',
        name: `Giant Slayer`,
        description: `+15% Critical Hit chance vs Bosses.  The first attack card this character targets a boss with per combat automatically crits.`,
        equippable: true,
        on: {},
    },
    eternalOptimist: {
        id: 'eternalOptimist',
        name: `Eternal Optimist`,
        description: `This character starts all Boss Fights and Elite encounters with Courageous (3).`,
        equippable: true,
        on: {},
    },
    emotionallySensitive: {
        id: 'emotionallySensitive',
        name: `Emotionally Sensitive`,
        description: `This character's Magic and Strength are increased by 8%+1.  Their Defense and Health are decreased by 4%.  Critical hits by this character deal an additional +25% damage.`,
        equippable: true,
        on: {},
    },
    distinctiveRibbit: {
        id: 'distinctiveRibbit',
        name: `Distinctive Ribbit`,
        description: `Increase the critical hit chance of allies by 3%.`,
        equippable: true,
        on: {},
    },
    slipperyWhenWet: {
        id: 'slipperyWhenWet',
        name: `slipperyWhenWet`,
        description: `If this character ends their turn with 0 block, they gain +20% block.`,
        equippable: true,
        on: {},
    },
    poisonousBlood: {
        id: 'poisonousBlood',
        name: `Poisonous Blood`,
        description: `If this character is attacked by an enemy while they have Bleed, apply Poison (20%) to the attacker.`,
        equippable: true,
        on: {},
    },
    stickyHands: {
        id: 'stickyHands',
        name: `Sticky Hands`,
        description: `Randomly keep one card in your hand at the end of your turn. (Unqiue)`,
        unique: true,
        equippable: true,
        on: {},
    },
    wiseCroaker: {
        id: 'wiseCroaker',
        name: `Wise Croaker`,
        description: `If you don't play any cards from this Kaiju in a turn, draw an additional card and this Kaiju gains Strongblock (1) at the beginning of your next turn.`,
        equippable: true,
        on: {},
    },
    excellentStompDancer: {
        id: 'excellentStompDancer',
        name: `Excellent Stomp Dancer`,
        description: `This Warhog's War Stomp card deals an additional 25% damage.`,
        equippable: true,
        on: {},
    },
    thickBoned: {
        id: 'thickBoned',
        name: `Thick Boned`,
        description: `Whenever you draw a card for this character, they gain +6% block.`,
        equippable: true,
        on: {},
    },
    shortTempered: {
        id: 'shortTempered',
        name: `Short Tempered`,
        description: `This character starts every room with Berserk (1) and Resistant (1).`,
        equippable: true,
        on: {},
    },
    ironSkinned: {
        id: 'ironSkinned',
        name: `Iron Skinned`,
        description: `This character is immune to Poison damage and Bleed.`,
        equippable: true,
        on: {},
    },
    bigYawn: {
        id: 'bigYawn',
        name: `Big Yarn`,
        description: `The first Defense card this character plays per room applies Tired (1) to all enemies.`,
        equippable: true,
        on: {},
    },
    apexOmnivore: {
        id: 'apexOmnivore',
        name: `Apex Omnivore`,
        description: `Critical Hits from this character have Piercing.`,
        equippable: true,
        on: {},
    },
    veryLarge: {
        id: 'veryLarge',
        name: `Very Large`,
        description: `The Health of this character is increased by 7.5%.`,
        equippable: true,
        on: {},
    },
    veryVeryLarge: {
        id: 'veryVeryLarge',
        name: `Very, Very, Large`,
        description: `The Health of this character is increased by 15%.`,
        equippable: true,
        on: {},
    },
    reinforcedHooves: {
        id: 'reinforcedHooves',
        name: `Reinforced Hooves`,
        description: `The Strength of this character is increased by 10%.`,
        equippable: true,
        on: {},
    },
    bigNapper: {
        id: 'bigNapper',
        name: `Big Napper`,
        description: `If you don't play any cards from this Kaiju in a turn, this Kaiju heals for 6% of their maximum health.`,
        equippable: true,
        on: {},
    },
    disarminglyCute: {
        id: 'disarminglyCute',
        name: `Disarmingly Cute`,
        description: `Every time this character plays an Attack Card, 20% chance of applying Fatigue (1) to enemies targeted.`,
        equippable: true,
        on: {},
    },
    anxietyRiddled: {
        id: 'anxietyRiddled',
        name: `Anxiety Riddled`,
        description: `The first time this character discards a card per room, draw 1.`,
        equippable: true,
        on: {},
    },
    extraBlubbery: {
        id: 'extraBlubbery',
        name: `Extra Blubbery`,
        description: `Whenever this character plays a card, they gain 10% block.`,
        equippable: true,
        on: {},
    },
    headEmpty: {
        id: 'headEmpty',
        name: `Head Empty`,
        description: `If you don't play any cards from this character in a turn, they gain +100% block.`,
        equippable: true,
        on: {},
    },
    doingTheirBest: {
        id: 'doingTheirBest',
        name: `Doing Their Best`,
        description: `If you play 3 cards owned by this character in one turn, remove all debuffs from this Kaiju.  They gain +50% block.`,
        equippable: true,
        on: {},
    },
    accidentProne: {
        id: 'accidentProne',
        name: `AccidentProne`,
        description: `Whenever a card from this character with Brittle breaks, apply Bleed (1) to all enemies.`,
        equippable: true,
        on: {},
    },
    peppy: {
        id: 'peppy',
        name: `Peppy`,
        description: `The first time per room this character plays 3 cards in 1 turn, gain 1 energy.`,
        equippable: true,
        on: {},
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
    },
    barbarian: {
        id: 'barbarian',
        name: `Barbarian`,
        description: `Increase this character's Strength by 8%. Increase the damage bonus Berserk gives this character by 10%`,
        equippable: true,
        on: {},
    },
    veteranPitFighter: {
        id: 'veteranPitFighter',
        name: `Veternal Pit Fighter`,
        description: `The first attack card this character plays per room costs 1 less energy.`,
        equippable: true,
        on: {},
    },
    royalGuard: {
        id: 'royalGuard',
        name: `Royal Guard`,
        description: `Increase the amount of block generated by Defense cards this character plays that target allies by 15%.`,
        equippable: true,
        on: {},
    },
    shieldProficiency: {
        id: 'shieldProficiency',
        name: `Shield Proficiency`,
        description: `Increase the amount of block generated by Defense cards this character plays by 10%.`,
        equippable: true,
        on: {},
    },
    intimidating: {
        id: 'intimidating',
        name: `Intimidating`,
        description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Tired (2).`,
        equippable: true,
        on: {},
    },
    terrifying: {
        id: 'terrifying',
        name: `Terrifying`,
        description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Fatigue (1).`,
        equippable: true,
        on: {},
    },
    attritionFighter: {
        id: 'attritionFighter',
        name: `Attrition Fighter`,
        description: `After your third turn, increase this character's Strength, Defense and Magic by 18% until the end of the room.`,
        equippable: true,
        on: {},
    },
    nobleGuardian: {
        id: 'nobleGuardian',
        name: `Noble Guardian`,
        description: `This character gives all other characters +15% block during the first turn of every room.`,
        equippable: true,
        on: {},
    },
    conduitOfChaosMagic: {
        id: 'conduitOfChaosMagic',
        name: `Conduit Of Chaos Magic`,
        description: `15% chance to gain +1 energy at the start of each turn.`,
        equippable: true,
        on: {},
    },
    privyToAnAncientandTerribleSecret: {
        id: 'privyToAnAncientandTerribleSecret',
        name: `Privy To Ancient and Terrible Secret`,
        description: `Every time you draw a card, there is a 10% chance that cards cost will be reduced by 1 (triggers a maximum of once per room).  The Magic of this character is increased by 10%.  The Health of this character is decreased by 10%.  This character starts each room with Tired (1).`,
        equippable: true,
        on: {},
    },
    legendaryFireMage: {
        id: 'legendaryFireMage',
        name: `Legendary Fire Mage`,
        description: `All Attack Cards this character plays have Fire Damage.`,
        equippable: true,
        on: {},
    },
    masterOracle: {
        id: 'masterOracle',
        name: `Master Oracle`,
        description: `Draw an additional card at the start of each turn. (Unique)`,
        equippable: true,
        on: {},
    },
    aspiringSeer: {
        id: 'aspiringSeer',
        name: `Aspiring Seer`,
        description: `Draw an additional card at the start of your first turn.  (Unique)`,
        equippable: true,
        on: {},
    },
    forgetfulGenius: {
        id: 'forgetfulGenius',
        name: `Forgetful Genius`,
        description: `Every time you draw a card, 20% chance to draw an additional card.`,
        equippable: true,
        on: {},
    },
    starChartExpert: {
        id: 'starChartExpert',
        name: `Star Chart Expert`,
        description: `Whenever an Attack, Defense, Utility, and Enchantment card are played in the same turn, deal 50% to all enemies.`,
        equippable: true,
        on: {},
    },
    tormentedByWhispers: {
        id: 'tormentedByWhispers',
        name: `Tormented by Whispers`,
        description: `When a card with Momentary is played, deal 10% damage to a random enemy. `,
        equippable: true,
        on: {},
    },
    photographicMemory: {
        id: 'photographicMemory',
        name: `Photographic Memory`,
        description: `Whenever a card with Momentary is played, it has a 20% chance to be added to the discard pile instead of being removed for the room. `,
        equippable: true,
        on: {},
    },
    dirtyDealer: {
        id: 'dirtyDealer',
        name: `Dirty Dealer`,
        description: `After the first combat of a run, draft an additional card. (Unique)`,
        equippable: true,
        on: {},
    },
    masterLooter: {
        id: 'masterLooter',
        name: `Master Looter`,
        description: `Every time a character destroys an enemy, draw a card.`,
        equippable: true,
        on: {},
    },
    thrifty: {
        id: 'thrifty',
        name: `Thrifty`,
        description: `The first time you discard a card per room, draw a card.`,
        equippable: true,
        on: {},
    },
    invigoratedbyBloodshed: {
        id: 'invigoratedbyBloodshed',
        name: `Invigorated by Bloodshed`,
        description: `Whenever an enemy is destroyed, this character gains Courageous (1) and Guarded (1).`,
        equippable: true,
        on: {},
    },
    scrappyandVicious: {
        id: 'scrappyandVicious',
        name: `Scrappy and Vicious`,
        description: `If you play 3 or more attack cards in a single turn, increase this character's strength by 33% until the end of the turn.`,
        equippable: true,
        on: {},
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
    },
    oneWithTheShadows: {
        id: 'oneWithTheShadows',
        name: `One with The Shadowd`,
        description: `Slightly decrease this character's Taunt at the start of each turn. (Decrease it by 3).`,
        equippable: true,
        on: {},
    },
}
