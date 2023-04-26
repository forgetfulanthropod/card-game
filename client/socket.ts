import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import type { ROCursor } from 'sbaobab'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

import type { GameState, RunScoreUpdate, UserID } from 'shared'
import { getTree, initializeBoababTree, isTreeInitialized } from '@/data'
import { getStringFromLocalStorage, startPixi } from '@/elementsUtil'
import { showScoreUpdateNotification } from '@/scenes/shared'
import { getClientEnv } from './util/getClientEnv'

const config = {
    enableExpensiveUpdateValidation: false,
    shouldLog: false,
}

const log = (...args: unknown[]) => config.shouldLog && console.log(...args)

const urlPrefix = window.location.href.split('/')[3]

let socket = null as unknown as Socket
export function prepareSocket(): void {
    // console.log('preparing socket...')
    if (socket != null) throw Error('socket is already prepared')
    socket = io({
        path:
            urlPrefix?.length > 0
                ? `/${urlPrefix}/server/socket`
                : '/server/socket',
    })
    socket.on('connect', () => {
        // console.log('connected to socket!')

        // todo:
        // check local storage for JWT
        // emit authentication or login event to server
        // server will then either say this JWT is still valid, or it needs to be reauthenticated (eg. another message signed)
        // we render start screen regardless, but if it needs authentication, trigger sign a message.

        const isLocalEnv = getClientEnv('IS_LOCAL')
        if (isLocalEnv) {
            // start game at last saved state on refresh
            const userId = getStringFromLocalStorage('userId')
            if (userId !== null) {
                socket.emit('userId', { userId, socketId: socket.id })
            }
        }
    })

    socket.on('refresh', () => window.location.reload())

    socket.on('update', ({ data }: { data: GameState }) => {
        // console.log('received server data', data)
        // getTree().set(data)
        updateBoabab(data)
    })

    socket.on('notifyScore', ({ data }: { data: RunScoreUpdate }) => {
        showScoreUpdateNotification(data)
    })
}

/** Loads gamestate on the server, and then is passed back to the client */
export function emitUserId(userId: string): void {
    if (socket == null) throw Error('socket is null')
    socket.emit('userId', { userId, socketId: socket.id })
}

export async function emitCallApi(args: {
    method: string
    data: any
    userId?: UserID
}) {
    if (socket == null) throw Error('socket is null')
    console.log('api call:', args)
    const response = await new Promise(resolve => {
        socket.emit('api', args, (response: any) => {
            resolve(response)
        })
    })
    // console.log('api response:', response)
    return response
}

type Unsub = Callback
export function socketOn(
    event: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void
): Unsub {
    if (socket == null) throw Error('socket is null')
    socket.on(event, callback)
    return () => socket.off(event, callback)
}

function updateBoabab(fromServer: GameState): void {
    // console.log('updating baobab...')
    if (!isTreeInitialized()) {
        initializeBoababTree(fromServer)
        console.log('starting pixi...')
        void startPixi(
            document.getElementById('pixi-root') as HTMLCanvasElement
        )
        return
    }
    const cursor = getTree().select()
    const oldState = cursor.get() as unknown
    const differences = calcDiff(oldState, fromServer)
    // not working on N level tree updates?
    // cards.hand key value pair removedand no differences..
    if (differences == null) {
        console.warn('received state update with no differences')
        // console.log(oldState, fromServer)
        return
    }
    for (const change of differences) {
        if (change.path == null) {
            console.warn('entire thing changed:', JSON.stringify(change))
            continue
        }
        // @ts-expect-error
        applyChange(change, cursor)
    }
    if (config.enableExpensiveUpdateValidation) {
        const newTree = cursor.get()
        const treeDifferences = calcDiff(oldState, newTree)
        const diffDiff = calcDiff(treeDifferences, differences)
        if (diffDiff != null) {
            console.warn(
                'diffs oldtree-vs-server and oldtree-vs-newtree are not the same',
                'this likely means there is an error in updateBaobab or applyChange',
                {
                    oldTree: oldState,
                    fromServer: fromServer,
                    newTree: newTree,
                    'oldtree-vs-server': differences,
                    'oldtree-vs-new-tree': treeDifferences,
                }
            )
        } else {
            log('diff seems to be applied correctly:', differences)
        }
    }
}

function applyChange<T>(change: Diff<T, T>, cursor: ROCursor<T>) {
    // @ts-expect-error (I don't have this in the wrapper right now)
    const path = cursor.path
    log('applying tree change:', change, 'at:', path)
    switch (change.kind) {
        case 'N': {
            // new property
            //@ts-expect-error
            cursor.set(change.path, change.rhs)
            break
        }
        case 'D': {
            // deleted property
            //@ts-expect-error
            cursor.unset(change.path)
            break
        }
        case 'E': {
            // edited property
            //@ts-expect-error
            cursor.set(change.path, change.rhs)
            break
        }
        case 'A': {
            // array change
            const { path, index: index, item } = change
            if (path == null) {
                console.warn('array change got null path')
                break
            }
            //@ts-expect-error
            applyChange(item, cursor.select([...path, index]))
            break
        }
    }
}
