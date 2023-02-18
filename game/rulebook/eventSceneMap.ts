import { EventId, EventScene } from 'shared/tree/EventScene'

export const eventSceneMap: Record<EventId, EventScene> = {
    frogCarriage: {
        id: 'frogCarriage',
        choices: [
            {
                souvenirId: 'frogWine',
            },
            {
                souvenirId: 'brokenCarriageWheel',
            },
            {
                souvenirId: 'bundleOfFrogWine',
            },
        ],
    },
    cursedStatue: {
        id: 'cursedStatue',
        choices: [
            {
                souvenirId: 'demonsLeftHand',
            },
            {
                souvenirId: 'demonsRightHand',
            },
            {
                souvenirId: null,
            },
        ],
    },
    gnomeStory: {
        id: 'gnomeStory',
        choices: [
            {
                souvenirId: 'nightmareBiscuit',
            },
            {
                souvenirId: 'glassOfWarmMilk',
            },
        ],
    },
    gnomeTooth: {
        id: 'gnomeTooth',
        choices: [
            {
                souvenirId: 'bigStinkyTooth',
            },
            {
                souvenirId: 'dentistryForDummies',
            },
        ],
    },
    hogClown: {
        id: 'hogClown',
        choices: [
            {
                souvenirId: 'clownInfestation',
            },
            {
                souvenirId: null,
            },
            {
                souvenirId: 'cowardsCrown',
            },
        ],
    },
}
