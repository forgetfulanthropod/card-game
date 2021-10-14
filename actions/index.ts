import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { Firestore } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import {firestore, initializeApp} from 'firebase-admin'
import { https, logger } from 'firebase-functions'

const app = initializeApp({
  projectId: 'kaiju-75e84',
})

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest((request, response) => {
  logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});
// export const makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//         // Grab the current value of what was written to Firestore.
//         const original = snap.data().original

//         // Access the parameter `{documentId}` with `context.params`
//         functions.logger.log('Uppercasing', context.params.documentId, original)

//         const uppercase = original.toUpperCase()

//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to Firestore.
//         // Setting an 'uppercase' field in Firestore document returns a Promise.
//         return snap.ref.set({ uppercase }, { merge: true })
//     })

// http://localhost:5001/kaiju-75e84/us-central1/helloWorld
// export const helloWorld = https.onCall((_data, _context) => {
//     return 'hello'
// })

let db: null | Firestore = null
export function maybeInitializeFirebase(): Firestore {
    if (db != null) return db
    db = getFirestore()
    connectFirestoreEmulator(db, 'localhost', 8080)
    return db
}

export interface FBCursor<T> {
    select<K extends keyof T>(k: K): FBCursor<T[K]>
    get(): T
    get<K extends keyof T>(k: K): T[K]
    set(v: T): void
    set<K extends keyof T>(k: K, v: T[K]): void
    apply<K extends keyof T>(k: K, f: (prev: T[K]) => T[K]): FBCursor<T[K]>
    on(eventName: 'update', cb: () => void): void
}

export function getBattleScene(): FBCursor<BattleScene> {
    return null as unknown as FBCursor<BattleScene>
}

export const tree = null as unknown as FBCursor<Gamestate>


// https://firebase.google.com/docs/functions/get-started#add-the-addmessage-function
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
export const addMessage = https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});

  });

  export const helloAgain = https.onRequest(async (req, res) => {
    const original = req.query.text;
    res.json({result: `Oh hello there. You said ${original}`});
  });
