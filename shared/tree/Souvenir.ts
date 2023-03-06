import { CardAction, CharacterUid } from './battle'

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
    | 'lilTaste'
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

export type SouvenirActivationKey =
    | 'acquire'
    | 'battleStart'
    | 'battleEnd'
    | 'turnStart'
    | 'turnEnd'
    //todo
    | 'enterRestSite'
    | 'lethalDamageInterrupt'
    | 'takeDamage'
    | 'dealDamage'
    | 'playCard'
    | 'activate'

export type Souvenir = {
    id: SouvenirId
    name: string
    equippable: boolean
    description: string
    characterUid?: CharacterUid
    targetNum?: number
    on: Partial<Record<SouvenirActivationKey, CardAction>>
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
        description:
            'Equipped Kaiju gains +6 defense,<br/>-2 strength, and -2 magic.',
        on: {
            acquire: 'modifyStats("defense|strength|magic", "6|-2|-2", "run")',
        },
    },
    dentistryForDummies: {
        id: 'dentistryForDummies',
        name: 'Dentistry for Dummies',
        equippable: true,
        description:
            'Equipped Kaiju receives +1 Magic after completing each room.',
        on: {
            battleEnd: 'modifyStats("magic", "1", "run")',
        },
    },
    frogWine: {
        id: 'frogWine',
        name: 'Frog Wine',
        equippable: false,
        description: 'All Kaiju gain +1 Strength, +1 Magic, and +1 Defense.',
        on: {
            acquire: 'modifyStats("strength|magic|defense", "1|1|1", "run")',
        },
    },
    brokenCarriageWheel: {
        id: 'brokenCarriageWheel',
        name: 'Broken Carriage Wheel',
        equippable: true,
        description:
            'Equipped Kaiju takes 2 damage and gains 2 Strength on equip.<br/>At the start of each room, apply Berserk (5) to equpped Kaiju.',
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
            'All Kaiju take 10 Damage.<br/>All Kaiju gain +2 Strength, +2 Magic, and +2 Defense.',
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
        description:
            'Equipped Kaiju gets<br/>+2 Strength, +2 Magic, and<br/>-12 max Health',
        on: {
            acquire:
                'modifyStats("strength|magic|constitution", "2|2|-12", "run")',
        },
    },
    demonsRightHand: {
        id: 'demonsRightHand',
        name: "Demon's Right Hand",
        equippable: true,
        description:
            'Equipped Kaiju gets<br/>+35 max Health, -1 Strength,<br/>and -1 Magic',
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
            'Equipped Kaiju receives +3 Strength, +3 Magic, and a permanent stack of Unguarded.',
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
            'Heal all party members for 8.  In addition, characters heal for an additional 8 HP whenever you enter a rest site.',
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
        description: `Equipped Kaiju Has -20 Constitution, -2 Strength, and -2 Magic.`,
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
            takeDamage: 'draw(1); discard(1)',
        },
    },
    lilTaste: {
        id: 'lilTaste',
        name: `Lil' Taste`,
        description: `Consecutive attacks against the same enemy deal an additional 10% damage`,
        equippable: false,
        on: {
            turnStart: 'effect("lilTaste", 1)',
        },
    },
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
        description: `Upon obtaining Pulled Rug, deal 7 damage to the character it's equipped to.  That character gains +3 Defense and starts every encounter with 7 block.
        If a character equipped with this souvenir ends their turn in Neutral Stance, they take 2 damage and gain Brave (1)`,
        equippable: true,
        on: {
            battleStart: 'addBlock(7)',
            turnEnd: `
                ifStance(
                    "neutral",
                    chain(
                        deal(2, null, "self"),
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
            battleStart: `drawSizeChange(-2)`,
            turnStart: `addEnergy(1)`,
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
            dealDamage: `if(lastCardPlayedType === "attack", effect("poisoned", 2))`,
        },
    },
    strangeHat: {
        id: 'strangeHat',
        name: `Strange Hat`,
        description: `Equipped Kaiju gains +3 Defense.`,
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
            //todo
            playCard: 'if(wasLastCardPlayedFromThisCharacter, addBlock(4))',
        },
    },
    woolBandana: {
        id: 'woolBandana',
        name: `Wool Bandana`,
        description: `Whenever equipped Kaiju ends its turn in a new stance, it gains 1 Orb of Lightning`,
        equippable: true,
        on: {
            //todo
            turnStart: 'effect("woolBandana", 1)',
        },
    },
    contaminatedRag: {
        id: 'contaminatedRag',
        name: `Contaminated Rag`,
        description: `Equipped Kaiju is immune to Poison Damage`,
        equippable: true,
        on: {
            //todo
            turnStart: 'effect("contaminatedRag", 1)',
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
            //todo
            turnEnd: 'ifStanceNotChanged(orb("frost", 1))',
        },
    },
    lavenderTea: {
        id: 'lavenderTea',
        name: `Lavender Tea`,
        description: `Set equipped Kaiju's stance to neutral after you end your turn.  Heal that character for 2.`,
        equippable: false,
        on: {
            turnEnd: 'setStance("neutral"); heal(2)',
        },
    },
    petRock: {
        id: 'petRock',
        name: `Pet Rock`,
        description: `Equipped Kaiju gains 1 block whenever a card is played.`,
        equippable: true,
        //todo
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
            acquire: 'heal(20)',
        },
    },
    bootlegExplosive: {
        id: 'bootlegExplosive',
        name: `Bootleg Explosive`,
        description: `Gain a charge when you play a utility card, When you play 3 attacks in 1 turn deal damage to all enemies equal to the number of charges on Bootleg Explosive, then remove all charges. Charges are retained between encounters`,
        equippable: false,
        on: {
            //todo
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
            //todo
            turnEnd: 'keep(1)',
        },
    },
    shinyMarble: {
        id: 'shinyMarble',
        name: `Shiny Marble`,
        description: `Deal 5 damage to a random enemy at the start of your turn.`,
        equippable: false,
        on: {
            //todo
            turnStart: `deal(5, null, "enemies")`,
        },
    },
    silkGloves: {
        id: 'silkGloves',
        name: `Silk Gloves`,
        description: `Equipped Kaiju gains +2 magic until end of turn whenever you play a card.`,
        equippable: true,
        on: {
            //todo
            playCard: 'modifyStats("magic", "2", "turn")',
        },
    },
    allPurposeKnob: {
        id: 'allPurposeKnob',
        name: `All Purpose Knob.`,
        description: `Activate this object to finish a room without gaining room rewards, and go to next room.(clickable!) <br/>Remove after use.`,
        equippable: false,
        on: {
            //todo
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
        description: `Activate to deal 25 damage to all enemies. This souvenir is destroyed after use.`,
        equippable: false,
        on: {
            activate: `deal(25, null, "allEnemies")`,
        },
    },
    demonCookie: {
        id: 'demonCookie',
        name: `Demon Cookie`,
        description: `Equipped Kaiju gains +5 strength and -5 Defense`,
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
            turnStart: `draw(1)`,
        },
    },
    stinkySandwich: {
        id: 'stinkySandwich',
        name: `Stinky Sandwich`,
        description: `Whenever equipped Kaiju takes damage from an attack, they get +2 defense until the end of the room.`,
        equippable: true,
        on: {
            takeDamage: `modifyStats("defense", "2", "room")`,
        },
    },
    bigSniff: {
        id: 'bigSniff',
        name: `Big Sniff`,
        description: `At the start of a new encounter, apply vulnerable 1 to a random enemy.`,
        equippable: false,
        targetNum: 1,
        on: {
            battleStart: `effect("vulnerable", 1, "enemies")`,
        },
    },
    organicBathSalts: {
        id: 'organicBathSalts',
        name: `Organic Bath Salts`,
        description: `Equipped Kaiju takes 2 less damage from attacks.`,
        equippable: true,
        on: {
            //todo
            turnStart: `effect("organicBathSalts", 1)`,
        },
    },
    lacedBathSalts: {
        id: 'lacedBathSalts',
        name: `Laced Bath Salts`,
        description: `Equipped Kaiju takes 2 extra damage from all attacks.  It gains a permanent stack of Brave.`,
        equippable: false,
        on: {
            //todo
            turnStart: `effect("lacedBathSalts", 1); effect("brave", 1)`,
        },
    },
    concreteShoes: {
        id: 'concreteShoes',
        name: `Concrete Shoes`,
        description: `Equipped Kaiju gets +8 defense and +35 health but can't change stances outside of cards and abilities that force them to do so.`,
        equippable: false,
        on: {
            //todo
            acquire: `modifyStats("defense", "5", "run"); modifyStats("constitution", "35", "run")`,
            turnStart: `effect("lockStance", 1)`,
        },
    },
}
