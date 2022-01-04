import type { Gamestate } from '@shared'
import type { SBaobab, SCursor } from 'baobab'
import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

import { getTree } from '@/data/rootTree'

const config = {
    enableExpensiveUpdateValidation: false,
    shouldLog: false,
}

const log = (...args: unknown[]) => config.shouldLog && console.log(...args)

const urlPrefix = window.location.href.split('/')[3]

// MARK
let socket: Socket = null as unknown as Socket
export function maybeMakeSocket(): void {
    if (socket == null)
        socket = io({
            path: urlPrefix?.length > 0 ? `/${urlPrefix}/socket` : '/socket',
        })
}
export function resolveWhenSocketConfirmed(): Promise<void> {
    maybeMakeSocket()
    log('waiting for socket connection with server')
    return new Promise(resolve => {
        socket.once('receivedConnection', data => {
            log('got server socket connection')
            console.log(`'hey' data from server: ${JSON.stringify(data)}`)
            resolve()
        })
    })
}

export function getSocket(): Socket {
    return socket
}

export async function waitForInitialGamestate(): Promise<Gamestate> {
    log('hoping for gamestate')
    maybeMakeSocket()
    return new Promise(resolve => {
        socket.once('update', ({ data, _path }) => {
            log('received gamestate')
            resolve(data as Gamestate)
        })
    })
}

export function attachServerListener(): void {
    log('attaching server listener')
    maybeMakeSocket()
    socket.on('update', ({ data, path }: { data: unknown; path: string[] }) => {
        log('received server data', data)
        // getTree().set(data)
        updateBoabab(data, path)
    })
}

function updateBoabab(fromServer: unknown, path: string[]): void {
    // @ts-expect-error
    const cursor = getTree().select(path) as SCursor<unknown>
    const oldState = cursor.get() as unknown
    const differences = calcDiff(oldState, fromServer)
    if (differences == null) {
        console.warn('no differences')
        return
    }
    for (const change of differences) {
        if (change.path == null) {
            console.warn('entire thing changed:', JSON.stringify(change))
            continue
        }
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

function applyChange<T>(change: Diff<T, T>, cursor: SCursor<T> | SBaobab<T>) {
    log('applying tree change:', change, 'at:', cursor.toString())
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
