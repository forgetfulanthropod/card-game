/** Exports all the API routes as functions */
import { httpsCallable } from 'firebase/functions'

import { maybeInitializeFirebase } from '@/fire'

export async function call(args: unknown) {
    try {
        const res = await httpsCallable(functions, 'helloWorld')()
    return res.data
    } catch (e) {
        console.error(`server error: ${e}`);
        return null;
    }
}

const { functions } = maybeInitializeFirebase()
