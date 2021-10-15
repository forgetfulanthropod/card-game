import { initializeApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import memoize from 'lodash/memoize'

export const maybeInitializeApp = memoize(function maybeInitializeApp(): { functions: Functions, db: Firestore } {
    const app = initializeApp({
        projectId: 'kaiju-75e84',
    })
    const functions = getFunctions(app)
    const db = getFirestore()
    connectFunctionsEmulator(functions, 'localhost', 5001)
    connectFirestoreEmulator(db, 'localhost', 8080)
    return { functions, db }
})
