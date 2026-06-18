import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import type { ROCursor } from 'sbaobab'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

import type { AllActionArgs, AllActionRes, AllActions, GameState, RunScoreUpdate } from 'shared'
import { getTree, initializeBaobabTree, isTreeInitialized } from '@/data'
import { getStringFromLocalStorage, startPixi } from '@/elementsUtil'
import { showScoreUpdateNotification } from '@/scenes/shared'
import { getClientEnv } from './util/getClientEnv'

const config = {
    enableExpensiveUpdateValidation: false,
    shouldLog: false,
}

const log = (...args: unknown[]) => config.shouldLog && console.log(...args)

const urlPrefix = window.location.href.split('/')[3]
const socketPath = urlPrefix?.length > 0
    ? `/${urlPrefix}/server/socket`
    : '/server/socket'

// Support overriding the server for mobile testing (e.g. phone talking to dev laptop)
// Set via localStorage.setItem('serverHost', 'http://192.168.x.x:3456') before launch
// or ?server=http://... in URL
const overrideHost = (() => {
    try {
        const params = new URLSearchParams(window.location.search)
        if (params.get('server')) return params.get('server')
        const stored = localStorage.getItem('serverHost')
        if (stored) return stored
    } catch {}
    return null
})()

const serverOrigin = overrideHost || window.location.origin

export const socket = io(serverOrigin, {
    path: socketPath,
    // ensure it tries ws then poll
    transports: ['websocket', 'polling'],
})

if (overrideHost) {
    console.log('[socket] Using overridden server host:', overrideHost)
}

export function prepareSocket() {
    console.log('preparing socket...')
    console.log({socket, socketId: socket.id})

    if (!getClientEnv('IS_PRODUCTION')) {
        // @ts-expect-error
        window.socket = socket
    }

    socket.on('connect', () => {
        console.log(`CONNECTED TO SOCKET ${socket.id}`)
    })
    socket.on('connect_error', (err) => {
        console.error('SOCKET CONNECT ERROR:', err?.message || err)
    })
    socket.on('disconnect', (reason) => {
        console.warn('SOCKET DISCONNECTED:', reason)
    })
    socket.on('refresh', () => window.location.reload())
    socket.on('update', updateBaobab)
    socket.on('notifyScore', ({ data }: { data: RunScoreUpdate }) => {
        showScoreUpdateNotification(data)
    })
}

export async function waitForSocket(): Promise<typeof socket> {
    return new Promise(resolve => {
        if (socket.connected) {
            resolve(socket)
            return
        }
        const cleanup = () => {
            socket.off('connect', onConnect)
            socket.off('connect_error', onErr)
            clearTimeout(to)
        }
        const onConnect = () => {
            cleanup()
            resolve(socket)
        }
        const onErr = (e: any) => {
            cleanup()
            console.error('waitForSocket connect_error', e?.message || e)
            resolve(socket)
        }
        const to = setTimeout(() => {
            cleanup()
            console.warn('waitForSocket timeout (5s), connected=', socket.connected)
            resolve(socket)
        }, 5000)
        socket.on('connect', onConnect)
        socket.on('connect_error', onErr)
        if (socket.connected) {
            cleanup()
            resolve(socket)
        }
    })
}

export async function emitApiCall<K extends keyof AllActions>(
    method: K,
    args: AllActionArgs[K]
) {
    const { userId } = getStringFromLocalStorage('userId')
    if (socket == null) throw Error('socket is null')
    if (!socket.connected) {
        await waitForSocket()
    }
    const response = (await new Promise(resolve => {
        const handler = (response: AllActionRes[K]) => resolve(response)
        socket.emit('api', { method, userId, ...args }, handler)
    })) as AllActionRes[K]
    return response
}

type Unsub = Callback
export function socketOn(
    event: string,
    callback: (...args: any[]) => void
): Unsub {
    if (socket == null) throw Error('socket is null')
    socket.on(event, callback)
    return () => socket.off(event, callback)
}

export function updateBaobab(fromServer: GameState): void {
    // console.log('updating baobab...')
    if (!isTreeInitialized()) {
        initializeBaobabTree(fromServer)
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

export function applyChange<T>(change: Diff<T, T>, cursor: ROCursor<T>) {
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
