import { SouvenirId } from './Souvenir'

export const disableEventScene = true

export type EventSceneMap = Record<EventId, EventScene>

export type EventScene = {
    id: EventId
    choices: EventChoice[]
}

export type EventChoice = {
    souvenirId: SouvenirId | null
}

export type EventId =
    | 'frogCarriage'
    | 'cursedStatue'
    // | 'gnomeStory'
    | 'gnomeTooth'
    | 'hogCoveredInClowns'
