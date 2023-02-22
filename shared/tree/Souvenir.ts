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
            'At the start of each room, apply Berserk (3) to equpped Kaiju.',
        on: {
            battleStart: 'chain(deal(2), effect("berserk", 3))',
        },
    },
    bundleOfFrogWine: {
        id: 'bundleOfFrogWine',
        name: 'Bundle of Frog Wine',
        equippable: false,
        description:
            'All Kaiju take 7 Damage.<br/>All Kaiju gain +3 Strength, +3 Magic, and +3 Defense.',
        on: {
            acquire:
                'chain(deal(7), modifyStats("strength|magic|defense", 3|3|3, "run"))',
        },
    },
    squeakyClownShoes: {
        id: 'squeakyClownShoes',
        name: 'Squeaky Clown Shoes',
        equippable: true,
        description:
            'Equipped Kaiju Ignores the effects of being in<br/>Aggressive stance.',
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
            'Equipped Kaiju gets<br/>+2 Strength, +2 Magic, and<br/>-10 max Health',
        on: {
            battleStart:
                'modifyStats("strength|magic|constitution", "2|2|-10", "run")',
        },
    },
    demonsRightHand: {
        id: 'demonsRightHand',
        name: "Demon's Right Hand",
        equippable: true,
        description:
            'Equipped Kaiju gets<br/>+30 max Health, -2 Strength,<br/>and -2 Magic',
        on: {
            battleStart:
                'modifyStats("strength|magic|constitution", "-2|-2|30", "run")',
        },
    },
    nightmareBiscuit: {
        id: 'nightmareBiscuit',
        name: 'Nightmare Biscuit',
        equippable: true,
        description:
            'Equipped Kaiju receives +4 Strength, +4 Magic, and a permanent stack of Unguarded.',
        on: {
            acquire: 'modifyStats("strength|magic", "4|4", "run")',
            turnEnd: 'effect("unguarded", 1)',
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
