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
                souvenirId: 'glassOfWarmMilk',
            },
            {
                souvenirId: 'nightmareBiscuit',
            },
        ],
    },
    gnomeTooth: {
        id: 'gnomeTooth',
        choices: [
            {
                souvenirId: 'dentistryForDummies',
            },
            {
                souvenirId: 'bigStinkyTooth',
            },
        ],
    },
    hogClown: {
        id: 'hogClown',
        choices: [
            {
                souvenirId: 'squeakyClownShoes',
            },
            {
                souvenirId: 'clownInfestation',
            },
            {
                souvenirId: 'cowardsCrown',
            },
        ],
    },
}
