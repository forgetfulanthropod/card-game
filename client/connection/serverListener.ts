import type { Gamestate } from '@shared'
import type { SBaobab } from 'baobab'
import type { SCursor } from 'baobab'
import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import { io } from 'socket.io-client'

import { getTree } from '@/data/rootTree'


const config = {
    enableExpensiveUpdateValidation: false,
    shouldLog: true,
}

function log(...args: unknown[]) {
    if (config.shouldLog) console.log(...args)
}

const urlPrefix = window.location.href.split('/')[3]
const socket = io({ path: urlPrefix?.length > 0 ? `/${urlPrefix}/socket` : '/socket' })
export function waitForHandshake(): Promise<void> {
    return new Promise(resolve => {
        log('got the hey')
        socket.once('hey', (data) => {
            console.log(`'hey' data from server: ${JSON.stringify(data)}`)
            resolve()
        })
    })
}


export function getSocket(): typeof socket {
    return socket
}


export async function listenForInitialGameState(): Promise<Gamestate> {
    log('hoping for gamestate')
    return new Promise(resolve => {
        socket.once('update', (data) => {
            log('received gamestate')
            resolve(data as Gamestate)
        })
    })
}

export function attachServerListener(): void {
    log('attaching server listener')
    socket.on('update', data => {
        log('received server data', data)
        // getTree().set(data)
        updateBoabab(data)
    })
}

function updateBoabab(fromServer: unknown): void {
    const newState = fromServer as unknown as Gamestate
    const gameStateCursor = getTree()
    const oldState = gameStateCursor.get()
    const differences = calcDiff(oldState, newState)
    if (differences == null) {
        console.warn('no differences')
        return
    }
    for (const change of differences) {
        if (change.path == null) {
            console.warn('entire thing changed:', JSON.stringify(change))
            continue
        }
        applyChange(change, gameStateCursor)
    }
    if (config.enableExpensiveUpdateValidation) {
        const newTree = gameStateCursor.get()
        const treeDifferences = calcDiff(oldState, newTree)
        const diffDiff = calcDiff(treeDifferences, differences)
        if (diffDiff != null) {
            console.warn(
                'diffs oldtree-vs-server and oldtree-vs-newtree are not the same',
                'this likely means there is an error in updateBaobab or applyChange',
                {
                    oldTree: oldState,
                    fromServer: newState,
                    newTree: newTree,
                    'oldtree-vs-server': differences,
                    'oldtree-vs-new-tree': treeDifferences,
                })
        } else {
            log('diff seems to be applied correctly:', differences)
        }
    }
}

function applyChange<T>(change: Diff<T, T>, cursor: SCursor<T> | SBaobab<T>) {
    log('applying tree change:', change, 'at:', cursor.toString())
    switch (change.kind) {
        case 'N': { // new property
            //@ts-expect-error
            cursor.set(change.path, change.rhs)
            break
        }
        case 'D': { // deleted property
            //@ts-expect-error
            cursor.unset(change.path)
            break
        }
        case 'E': { // edited property
            //@ts-expect-error
            cursor.set(change.path, change.rhs)
            break
        }
        case 'A': { // array change
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
