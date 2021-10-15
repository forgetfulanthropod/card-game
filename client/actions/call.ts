/** Exports all the API routes as functions */
import type { Caller, CallReturn, Func } from '@shared/actions'
import { httpsCallable } from 'firebase/functions'

import { maybeInitializeFirebase } from '@/fire'

export function callWrap<F extends Func>(name: string): Caller<F> {
    const doCall: Caller<F> = async (...args) => {
        try {
            const res = await httpsCallable(functions, name)(args)
            return res.data as CallReturn<F>
        } catch (e) {
            console.error(`server error: ${e}`)
            return { status: 'error', message: 'error connecting to server' }
        }
    }
    return doCall
}


const { functions } = maybeInitializeFirebase()
