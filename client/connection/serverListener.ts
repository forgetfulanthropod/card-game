// **TODO**: write the code in this file
import { getTree } from '@/data/rootTree'
import type { Gamestate, MyBaobab, MyCursor } from '@shared/index'
import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'

const config = {
    enableExpensiveUpdateValidation: false,
    logChanges: false,
}

export async function getGameState(): Promise<Gamestate> {
    return null as unknown as Gamestate
}

export function attachServerListener(): void {
    // TODO
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
            console.log('diff seems to be applied correctly:', differences)
        }
    }
    // TODO: deep diff update. see pathDiff in client/util/index
    //const key = datastoreEvent.path
    //const data = datastoreEvent.newData
    //getTree().apply(key, data)
}

function applyChange<T>(change: Diff<T, T>, cursor: MyCursor<T> | MyBaobab<T>) {
    if (config.logChanges) console.log('applying tree change:', change, 'at:', cursor.toString())
    switch (change.kind) {
        case 'N': { // new property
            // @ts-ignore
            cursor.set(change.path, change.rhs)
            break
        }
        case 'D': { // deleted property
            cursor.unset(change.path)
            break
        }
        case 'E': { // edited property
            // @ts-ignore
            cursor.set(change.path, change.rhs)
            break
        }
        case 'A': { // array change
            const { path, index: index, item } = change
            // @ts-ignore
            applyChange(item, cursor.select([...path, index]))
            break
        }
    }
}
