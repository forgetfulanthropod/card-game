// **TODO**: write the code in this file
import type { Gamestate } from '@shared/index'
import type { DocumentData} from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore'

import { tree } from '@/data/rootTree'

import { maybeInitializeFirebase } from '.'


export function getGameState(): Gamestate {
    return null as unknown as Gamestate
}

// https://firebase.google.com/docs/firestore/query-data/listen
export function attachFirestoreListener(): void {
    //firestore.onChange(change => updateBaobab(change))
    const { db } = maybeInitializeFirebase()
    const _unsub = onSnapshot(doc(db, 'users', 'alice'),
        function onNext(doc) {
            const data = doc.data()
            if (data != null)
            updateBoabab(data)
        },
        function onError(err) { console.error('Firestore error: ', err) }
    )
}

function updateBoabab(data: DocumentData): void {
    tree.set(data as unknown as Gamestate)
    // TODO: deep diff update. see pathDiff in client/util/index
    //const key = firestoreEvent.path
    //const data = firestoreEvent.newData
    //tree.apply(key, data)
}
