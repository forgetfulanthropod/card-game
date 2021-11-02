import type {
    BattleScene,
    EntryScene,
    Gamestate,
    MoveEvent,
} from '@shared'
import type { SCursor } from 'baobab'
import { SBaobab } from 'baobab'
import { memoize } from 'lodash'

import { getIo } from '@/index'


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
    return getRootCursor().select('users').select(username)
}

export interface RootTree {
    users: {
        alice: Gamestate
    }
    testCounters: { counter0: number }
}

export function commit(cursor: { get: () => unknown }, customName?: string, justSub = false): void {
    // TODO eventually: just commit Sub probably or maybe commit changes (diff)
    logger.info('committing')
    if (customName != null) { logger.info('committing to event name ', customName, 'and justSub is', justSub) }
    if (justSub) {
        getIo().emit(customName ?? 'update', cursor.get())
        return
    }
    getIo().emit(customName ?? 'update', getRootCursor().select('users').select('alice').get())
}

export const getRootCursor = memoize(function getRootCursor(): SCursor<RootTree> {
    const b = new SBaobab({
        contents: {
            users: {
                alice: null as unknown as Gamestate,

            },
            testCounters: { counter0: 0 },
        },
    })
    return b.select('contents')
})
