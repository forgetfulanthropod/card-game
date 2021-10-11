/** Exports all the API routes as functions */
import { maybeInitializeFirebase } from 'fire'
import { httpsCallable } from 'firebase/functions'

const { functions } = maybeInitializeFirebase()
export async function helloWorld(): Promise<string> {
    const res = await httpsCallable(functions, 'helloWorld')()
    return res.data as string
}
