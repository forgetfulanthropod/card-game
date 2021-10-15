import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { Firestore } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { firestore, initializeApp } from 'firebase-admin'
import { https, logger } from 'firebase-functions'

import type { FBCursor } from './FBCursor'
import { makeFBCursor } from './FBCursor'

initializeApp({
    projectId: 'kaiju-75e84',
})

const wrapper = onRequestWrapper

function onRequestWrapper<ReturnType>(f: (u: unknown) => ReturnType) {
    return https.onRequest(async (request, response) => {
        try {
            const result = await f(request.query)
            response.send({ status: 'success', result })
        } catch (e) {
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}
function onCallWrapper<ReturnType>(f: (u: unknown, context?: https.CallableContext) => ReturnType) {
    return https.onCall(async (data, context) => {
        try {
            const result = await f(data, context)
            return { status: 'success', result }
        } catch (e) {
            return { status: 'error', message: JSON.stringify(e) }
        }
    })
}



type Empty = Record<string, never> | null | undefined
export const helloWithLogs = wrapper(function helloWithLogs(_args: Empty) {
    logger.info('Hello logs!', { structuredData: true })
    return 'Hello from Firebase!'
})

export const justHello = wrapper(function justHello(_args: Empty) {
    return 'hello'
})

export const square = wrapper(function square(args: { n: string }) {
    const m = Number(args.n)
    return m * m
})

export const helloWithFirestore = wrapper(async function helloWithFirestore(args: { text: string }) {
    const original = args.text
    const writeResult = await firestore().collection('messages').add({ original: original })
    // Send back a message that we've successfully written the message
    return { result: `Message with ID: ${writeResult.id} added.` }
})

let db: null | Firestore = null
export function maybeInitializeFirebase(): Firestore {
    if (db != null) return db
    db = getFirestore()
    connectFirestoreEmulator(db, 'localhost', 8080)
    return db
}

export function getBattleScene(): FBCursor<BattleScene> {
    const docRef = doc(db, 'users', 'alice')
    return makeFBCursor(docRef, [])
}

export const tree = null as unknown as FBCursor<Gamestate>
