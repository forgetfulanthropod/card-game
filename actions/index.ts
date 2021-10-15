import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { Firestore } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase-admin'
import { https } from 'firebase-functions'

import type { FBCursor } from './FBCursor'
import { makeFBCursor } from './FBCursor'
import { changeScene_, chooseDoor_, putUpDoors_, } from './functions'
initializeApp({
    projectId: 'kaiju-75e84',
})

const wrapper = onRequestWrapper
export const changeScene = wrapper(changeScene_)
export const putUpDoors = wrapper(putUpDoors_)
export const chooseDoor = wrapper(chooseDoor_)

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
