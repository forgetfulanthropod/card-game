export type SouvenirMap = Record<SouvenirId, Souvenir>

export type SouvenirId =
    | 'bigStinkyTooth'
    | 'dentistryForDummies'
    | 'frogWine'
    | 'brokenCarriageWheel'
    | 'bundleOfFrogWine'
    | 'squeakyClownShoes'
    | 'cowardsCrown'
    | 'clownInfestation'
    | 'demonsLeftHand'
    | 'demonsRightHand'

export type Souvenir = {
    id: SouvenirId
    name: string
    equippable: boolean
    description: string
    actions: {
        onAcquire?: string
        onBattleEnd?: string
        onBattleStart?: string
    }
}

export const souvenirMap: Record<SouvenirId, Souvenir> = {
    bigStinkyTooth: {
        id: 'bigStinkyTooth',
        name: 'Big Stinky Tooth',
        equippable: true,
        description:
            'Equipped Kaiju gains +5 defense,<br/>-2 strength, and -2 magic.',
        actions: {
            onAcquire:
                'modifyStats("defense|strength|magic", "5|-2|-2", "run")',
        },
    },
    dentistryForDummies: {
        id: 'dentistryForDummies',
        name: 'Dentistry for Dummies',
        equippable: true,
        description:
            'Equipped Kaiju gains: “Give this Kaiju<br/> +2 Magic at the end of every battle.”',
        actions: {
            onBattleEnd: 'modifyStats("magic", "2", "run")',
        },
    },
    frogWine: {
        id: 'frogWine',
        name: 'Frog Wine',
        equippable: false,
        description: 'All Kaiju gain +1 Strength, +1 Magic, and +1 Defense.',
        actions: {
            onAcquire: 'modifyStats("strength|magic|defense", "1|1|1", "run")',
        },
    },
    brokenCarriageWheel: {
        id: 'brokenCarriageWheel',
        name: 'Broken Carriage Wheel',
        equippable: false,
        description:
            'Equipped Kaiju gains: “Gain Berserk (3) and take 2 damage when entering a new encounter."',
        actions: {
            onBattleStart: 'chain(deal(2), effect("berserk", 3))',
        },
    },
    bundleOfFrogWine: {
        id: 'bundleOfFrogWine',
        name: 'Bundle of Frog Wine',
        equippable: false,
        description:
            'All Kaiju take 7 Damage.<br/>All Kaiju gain +3 Strength, +3 Magic, and +3 Defense.',
        actions: {
            onAcquire:
                'chain(deal(7), modifyStats("strength|magic|defense", 3|3|3, "run"))',
        },
    },
    squeakyClownShoes: {
        id: 'squeakyClownShoes',
        name: 'Squeaky Clown Shoes',
        equippable: true,
        description:
            'Equipped Kaiju Ignores the effects of being in<br/>Aggressive stance.',
        actions: {
            onBattleStart: 'effectPermanent("ignoreAggressive")',
        },
    },
    cowardsCrown: {
        id: 'cowardsCrown',
        name: 'Cowards Crown',
        equippable: false,
        description: 'All Kaiju deal 10% more damage when in avoidant stance',
        actions: {
            //TODO
            onBattleStart: 'effectPermanent("cowardsCrown")',
        },
    },
    clownInfestation: {
        id: 'clownInfestation',
        name: 'Clown Infestation',
        equippable: true,
        description:
            'When entering a new Encounter, add a random “Gnome Prank” card you your hand.',
        actions: {
            //TODO
            onBattleStart: 'addCard("gnomePrank*", "hand")',
        },
    },
    demonsLeftHand: {
        id: 'demonsLeftHand',
        name: "Demon's Left Hand",
        equippable: true,
        description:
            'Equipped Kaiju gets<br/>+2 Strength, +2 Magic, and<br/>-10 max Health',
        actions: {
            onBattleStart:
                'modifyStats("strength|magic|constitution", "2|2|-10", "run")',
        },
    },
    demonsRightHand: {
        id: 'demonsRightHand',
        name: "Demon's Right Hand",
        equippable: false,
        description:
            'Equipped Kaiju gets<br/>+30 max Health, -2 Strength,<br/>and -2 Magic',
        actions: {
            onBattleStart:
                'modifyStats("strength|magic|constitution", "-2|-2|30", "run")',
        },
    },
}
