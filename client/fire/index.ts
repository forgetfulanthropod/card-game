import { initializeApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import memoize from 'lodash/memoize'

export const maybeInitializeApp = memoize(function maybeInitializeApp(): { functions: Functions, db: Firestore } {
    // These are client keys, so it's fine to commit them.
    const firebaseConfig = {
        apiKey: 'AIzaSyDavWqGtoB5JavUmkz_l4EdtFhxETFkB2o',
        authDomain: 'kaiju-75e84.firebaseapp.com',
        projectId: 'kaiju-75e84',
        storageBucket: 'kaiju-75e84.appspot.com',
        messagingSenderId: '1004107907735',
        appId: '1:1004107907735:web:d180cfa470b5b5c6365fd2'
    }
    const app = initializeApp(firebaseConfig)
    const functions = getFunctions(app)
    const db = getFirestore()
    if (process.env.CLIENT_IS_LOCAL === 'yes') {
        connectFunctionsEmulator(functions, 'localhost', 5001)
        connectFirestoreEmulator(db, 'localhost', 8080)
    }
    return { functions, db }
})
