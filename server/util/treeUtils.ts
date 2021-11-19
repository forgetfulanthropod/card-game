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


export function getEntryScene(username: string): SCursor<EntryScene> {
    const scene = getGameStateCursor(username).select('scene')
    // debugger
    if (scene.get('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as SCursor<EntryScene>
}

export type BattleCursor = SCursor<BattleScene>
export function getBattleScene(username: string): BattleCursor {
    const scene = getGameStateCursor(username).select('scene')
    if (scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

type EventCursor = SCursor<MoveEvent[]>
export function getEventsCursor(username: string): EventCursor {
    const events = getGameStateCursor(username).select('events').select('move')

    return events as EventCursor
}

export function getGameStateCursor(username: string): SCursor<Gamestate> {
    return getRootCursor().select('users').select(username)
}

interface RootTree {
    users: Record<string, Gamestate>
    testCounters: { counter0: number }
}

export function commit(cursor: SCursor<unknown>): void {
    logger.info('committing')

    const path = cursor.path as string[]
    getIo().emit('update', { data: cursor.get(), path: path.slice(3) })
}
export function fullUserCommit(userCursor: SCursor<unknown>): void {
    commit(userCursor)
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
