import { SouvenirId } from './Souvenir'

export type EventSceneMap = Record<EventId, Event>

export type EventId =
    | 'frogCarriage'
    | 'cursedStatue'
    | 'gnomeStory'
    | 'gnomeTooth'
    | 'hogCoveredInClowns'

export type Event = {
    id: EventId
    choices: EventChoice[]
}

export type EventChoice = {
    souvenirId: SouvenirId | null
}

export const eventScenes: Record<EventId, Event> = {
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
            // {
            //     souvenirId: 'nightmareBiscuit',
            // },
            // {
            //     souvenirId: 'glassOfWarmMilk',
            // },
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
    hogCoveredInClowns: {
        id: 'hogCoveredInClowns',
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
