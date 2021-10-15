/** Exports all the API routes as functions */
import type { CallReturn } from '@shared/actions'
import { httpsCallable } from 'firebase/functions'

import { maybeInitializeFirebase } from '@/fire'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function call<F extends (u: any) => any>(name: string, ...args: Parameters<F>): Promise<CallReturn<F>> {
    try {
        const res = await httpsCallable(functions, name)(args)
        return res.data as CallReturn<F>
    } catch (e) {
        console.error(`server error: ${e}`)
        return { status: 'error', message: 'error connecting to server' }
    }
}

const { functions } = maybeInitializeFirebase()
