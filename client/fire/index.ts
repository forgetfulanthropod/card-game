import { initializeApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'


type Result = { functions: Functions, db: Firestore }
let result: Result | null = null
export function getDbAndFunctions(): Result {
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
