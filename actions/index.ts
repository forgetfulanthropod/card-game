import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { Firestore } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase-admin'
import type { App } from 'firebase-admin/app'
import { https } from 'firebase-functions'

import { dispatch as dispatch_ } from './'
import type { FBCursor } from './FBCursor'
import { makeFBCursor } from './FBCursor'
import { changeScene_, chooseDoor_, doCharacterAction_, getRulebook_, hello_, makeNewUser_, putUpDoors_, startGame_, } from './functions'

let app: null | App = null

function startFirebaseApp() {
    if (app != null) return app
    app = initializeApp({
        projectId: 'kaiju-75e84',
    }) // providing a name as second arg allows multiple initializeApp() calls
    return app
}
// startFirebaseApp()

const wrapper = onRequestWrapper // or onCallWrapper

export const changeScene = wrapper(changeScene_)
export const putUpDoors = wrapper(putUpDoors_)
export const chooseDoor = wrapper(chooseDoor_)
export const dispatch = wrapper(dispatch_)
export const hello = wrapper(hello_)
export const getRulebook = wrapper(getRulebook_)
export const startGame = wrapper(startGame_)
export const doCharacterAction = wrapper(doCharacterAction_)
export const makeNewUser = wrapper(makeNewUser_)


function onRequestWrapper<ReturnType>(f: (u: unknown) => ReturnType) {
    startFirebaseApp()
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
    startFirebaseApp()
    return https.onCall(async (data, context) => {
        try {
            const result = await f(data, context)
            return { status: 'success', result }
        } catch (e) {
            return { status: 'error', message: JSON.stringify(e) }
        }
    })
}

let db: null | Firestore = null
export function getDb(): Firestore {
    initializeApp()
    if (db != null) return db
    db = getFirestore()
    connectFirestoreEmulator(db, 'localhost', 8080)
    return db
}

export async function getBattleScene(username: 'alice'): Promise<FBCursor<Gamestate, BattleScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (await scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as FBCursor<Gamestate, BattleScene>
}

export async function getGameStateCursor(username: 'alice'): Promise<FBCursor<Gamestate>> {
    const docRef = doc(db, 'users', username)
    if (!(await getDoc(docRef)).exists) {
        throw Error('could not find user doc')
    }
    return makeFBCursor(docRef, [])
}
