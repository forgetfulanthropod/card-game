import type { Firestore } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase-admin'
import type { App } from 'firebase-admin/app'

// TOGGLE: choose function network interface type
// const wrapper = onCallWrapper
let app: null | App = null

export function startFirebaseApp(): App {
    if (app != null)
        return app
    app = initializeApp({
        projectId: 'kaiju-75e84',
    }) // providing a name as second arg allows multiple initializeApp() calls
    return app
}
// startFirebaseApp()
export let db: null | Firestore = null
export function getDb(): Firestore {
    initializeApp()
    if (db != null)
        return db
    db = getFirestore()
    connectFirestoreEmulator(db, 'localhost', 8080)
    return db
}
