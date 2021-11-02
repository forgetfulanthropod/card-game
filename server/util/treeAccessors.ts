import type {
    BattleScene,
    EntryScene,
    Gamestate,
    MoveEvent,
} from '@shared'
import type { SCursor } from 'baobab'

import { makeRootDataCursor } from './DataCursor'


export function getEntryScene(username: 'alice'): SCursor<EntryScene> {
    const scene = getGameStateCursor(username).select('scene')
    // debugger
    if (scene.get('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as SCursor<EntryScene>
}

export type BattleCursor = SCursor<BattleScene>
export function getBattleScene(username: 'alice'): BattleCursor {
    const scene = getGameStateCursor(username).select('scene')
    if (scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export type EventCursor = SCursor<MoveEvent[]>
export function getEventsCursor(username: 'alice'): EventCursor {
    const events = getGameStateCursor(username).select('events')

    return events as EventCursor
}

export function getGameStateCursor(username: 'alice'): SCursor<Gamestate> {
    return makeRootDataCursor().select('users').select(username)
}

export interface RootTreeShit {
    users: {
        alice: Gamestate
    }
    testCounters: { counter0: number }
}
export function getRootCursor(): SCursor<RootTreeShit> {
    return makeRootDataCursor()
}
