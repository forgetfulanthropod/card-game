import type {
    BattleScene,
    EntryScene,
    Gamestate,
} from '@shared'
import type { SCursor } from 'baobab'
import { SBaobab } from 'baobab'
import { memoize } from 'lodash'

import { getIo, getSocketId } from '@/index'


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


export function getGameStateCursor(username: string): SCursor<Gamestate> {
    return getRootCursor().select('users').select(username)
}

interface RootTree {
    users: Record<string, Gamestate>
    testCounters: { counter0: number }
}

export function commit<A>(cursor: SCursor<A>, username: string): void {

    const socketId = getSocketId(username)
    const path = cursor.path as string[]
    logger.info(`committing to user ${username} (id ${socketId})`)
    getIo().to(socketId).emit('update', { data: cursor.get(), path: path.slice(3) })
}

export function emit(args: { username: string; event: string; data: unknown }): void {
    getGameStateCursor(args.username).select('events').select(args.event).push(args.data)
    const socketId = getSocketId(args.username)
    getIo().to(socketId).emit(args.event, args.data)
}


// hmm if we made each user a separate tree then random functions could call .root() and not need to know the username...

export const getRootCursor = memoize(function getRootCursor(): SCursor<RootTree> {
    const b = new SBaobab({
        contents: {
            users: {},
            testCounters: { counter0: 0 },
        },
    })
    const result = b.select('contents')
    return result
})
