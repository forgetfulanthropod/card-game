// **TODO**: write the code in this file
import type { Gamestate, MyBaobab, MyCursor } from '@shared/index'
import type { Diff } from 'deep-diff'
import { diff as calcDiff } from 'deep-diff'
import type { DocumentData } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { doc, onSnapshot } from 'firebase/firestore'

import { getTree } from '@/data/rootTree'

import { maybeInitializeApp } from '.'


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
    const oldState = getTree().get()
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
        applyChange(change, getTree())
    }
    // TODO: deep diff update. see pathDiff in client/util/index
    //const key = firestoreEvent.path
    //const data = firestoreEvent.newData
    //getTree().apply(key, data)
}

function applyChange<T>(change: Diff<T, T>, cursor: MyCursor<T> | MyBaobab<T>) {
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
            const { path, index, item } = change
            // @ts-ignore
            applyChange(cursor.select([...path, index]), item)
        }
    }
}
