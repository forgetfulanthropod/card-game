import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions'



type Result = { functions: Functions, db: Firestore }
let result: Result | null = null
export function maybeInitializeFirebase(): Result {
    if (result != null) return result
    const app = initializeApp({
        projectId: 'kaiju-75e84',
    })
    const functions = getFunctions(app)
    const db = getFirestore()
    connectFunctionsEmulator(functions, 'localhost', 5001)
    connectFirestoreEmulator(db, 'localhost', 8080)
    result = { functions, db }
    return result
}
