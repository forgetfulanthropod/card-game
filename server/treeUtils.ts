import type {
    BattleCursor,
    BattleScene,
    EntryScene,
    Gamestate,
    NetworkEvent,
} from 'shared'
import { memoize } from 'lodash'
import { JSONFile, Low } from 'lowdb'
import type { ROCursor, SCursor } from 'sbaobab'
import { SBaobab } from 'sbaobab'

import { getIo, getSocketId } from './index'
const db = new Low<{ users: Record<string, Gamestate> }>(
    new JSONFile(__dirname + '/db.json')
)
void db.read().then(() => {
    db.data = db.data ?? { users: {} }
    void db.write()
})

export function getDb() {
    return db
}

export function getEntryScene(username: string): SCursor<EntryScene> {
    const scene = getGameStateCursor(username).select('scene')
    if (scene.get('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as SCursor<EntryScene>
}

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
    if (db.data) {
        db.data.users[username] = getRootCursor().select('users').get(username)
        void db.write()
    }
    getIo()
        .to(socketId)
        .emit('update', { data: cursor.get(), path: path.slice(3) })
}

export function stampedEmit<_A extends string, _B>(args: {
    username: string
    event: NetworkEvent<_A, _B>
}): void {
    emit({
        ...args,
        event: {
            ...args.event,
        },
    })
}

export function emit<_A extends string, _B>(args: {
    username: string
    event: NetworkEvent<_A, _B>
}): void {
    getGameStateCursor(args.username)
        .select('events')
        .select(args.event.type)
        .apply(arr => [
            ...arr,
            {
                sentAt: new Date().toLocaleDateString(),
                uid: srandom().toString().slice(6),
                ...args.event,
            },
        ])
    const socketId = getSocketId(args.username)
    getIo().to(socketId).emit(args.event.type, args.event)
}

// hmm if we made each user a separate tree then random functions could call .root() and not need to know the username...

export const getRootCursor = memoize(
    function getRootCursor(): SCursor<RootTree> {
        const b = new SBaobab({
            contents: {
                users: {},
                testCounters: { counter0: 0 },
            },
        })
        const result = b.select('contents')
        return result
    }
)
