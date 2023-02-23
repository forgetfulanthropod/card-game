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

export type SouvenirActivationKey =
    | 'acquire'
    | 'battleStart'
    | 'battleEnd'
    | 'turnStart'
    | 'turnEnd'

export type Souvenir = {
    id: SouvenirId
    name: string
    equippable: boolean
    description: string
    characterUid?: CharacterUid
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
            'Equipped Kaiju gains +5 defense,<br/>-2 strength, and -2 magic.',
        on: {
            acquire: 'modifyStats("defense|strength|magic", "5|-2|-2", "run")',
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
            'Equipped Kaiju takes 2 damage and gains 1 Strength on equip.<br/>At the start of each room, apply Berserk (5) to equpped Kaiju.',
        on: {
            acquire: 'deal(2); modifyStats("strength", "1", "run")',
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
            'Equipped Kaiju ignores stance damage modifiers while in Aggressive&nbspStance',
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
            'At the start of a new Encounter, apply Vulnerable (1) to all friendly characters.  Apply Vulnerable (2) to all enemy characters. ',
        on: {
            battleStart:
                'chain(effect("vulnerable", 1, "allFriends"), effect("vulnerable", 2, "allEnemies"))',
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
}
