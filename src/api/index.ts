/** Exports all the API routes as functions */
import { maybeInitializeFirebase } from '@/fire'
import { httpsCallable } from 'firebase/functions'

const { functions } = maybeInitializeFirebase()
export async function helloWorld(): Promise<string> {
    const res = await httpsCallable(functions, 'helloWorld')()
    const data = res.data as string
    console.log("hello world got:", data)
    return data
}
