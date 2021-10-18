// **TODO**: write the code in this file
import type { Gamestate, MyBaobab, MyCursor } from '@shared/index'
import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import type { DocumentData } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { doc, onSnapshot } from 'firebase/firestore'

// import isEqual from 'lodash/isEqual'
import { getTree } from '@/data/rootTree'

import { maybeInitializeApp } from '.'

const config = {
    enableExpensiveUpdateValidation: false,
    logChanges: true,
}

export async function getGameState(): Promise<Gamestate> {
    const { db } = maybeInitializeApp()
    const d = await getDoc(doc(db, 'users', 'alice'))
    if (!d.exists) {
        throw Error('game state d does not exist')
    }
    const data = d.data() as Gamestate
    if (data?.inventory == null) {
        throw Error('document has no inventory key. Likely doc does not exist.')
    }
    return data as Gamestate
}

// https://firebase.google.com/docs/firestore/query-data/listen
export function attachFirestoreListener(): void {
    //firestore.onChange(change => updateBaobab(change))
    const { db } = maybeInitializeApp()
    const _unsub = onSnapshot(doc(db, 'users', 'alice'),
        function onNext(doc) {
            const data = doc.data()
            if (data != null)
                updateBoabab(data)
            else
                console.warn('doc.data was null')
        },
        function onError(err) { console.error('Firestore error: ', err) }
    )
}

/** UNTESTED */
function updateBoabab(data: DocumentData): void {
    const newState = data as unknown as Gamestate
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
                'diffs oldtree-vs-firebase and oldtree-vs-newtree are not the same',
                'this likely means there is an error in updateBaobab or applyChange',
                {
                    oldTree: oldState,
                    fromFirebase: newState,
                    newTree: newTree,
                    'oldtree-vs-firebase': differences,
                    'oldtree-vs-new-tree': treeDifferences,
                })
        } else {
            console.log('diff seems to be applied correctly:', differences)
        }
    }
    // TODO: deep diff update. see pathDiff in client/util/index
    //const key = firestoreEvent.path
    //const data = firestoreEvent.newData
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
            switch (item.kind) {
                case 'N':
                    // @ts-ignore
                    cursor.set([...path, index], item.rhs)
                    break
                case 'D':
                    // @ts-ignore
                    cursor.apply(path, arr => [...arr.slice(0, index), ...arr.slice(index + 1)])
                    break
                case 'E':
                    // @ts-ignore
                    cursor.set([...path, index], item.rhs)
                    break
                case 'A':
                    throw Error('not implemented')
            }
        }
    }
}
