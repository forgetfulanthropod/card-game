import { MoveEvent } from '@shared/networkEvents'
import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { EntryScene } from '@shared/entryTypes'
import type { DataCursor } from './DataCursor'
import { makeRootDataCursor } from './DataCursor'



export function getEntryScene(username: 'alice'): DataCursor<Gamestate, EntryScene> {
    const scene = getGameStateCursor(username).select('scene')
    // debugger
    if (scene.getK('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as DataCursor<Gamestate, EntryScene>
}

export type BattleCursor = DataCursor<Gamestate, BattleScene>
export function getBattleScene(username: 'alice'): BattleCursor {
    const scene = getGameStateCursor(username).select('scene')
    if (scene.getK('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export type EventCursor = DataCursor<Gamestate, MoveEvent[]>
export function getEventsCursor(username: 'alice'): EventCursor {
    const events = getGameStateCursor(username).select('events')

    return events as EventCursor
}

export function getGameStateCursor(username: 'alice'): DataCursor<Gamestate> {
    return makeRootDataCursor().select('users').select(username)
}

export interface RootTreeShit {
    users: {
        alice: Gamestate
    }
    testCounters: { counter0: number }
}
export function getRootCursor(): DataCursor<RootTreeShit> {
    return makeRootDataCursor()
}
