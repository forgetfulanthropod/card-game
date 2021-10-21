/** Exports all the API routes as functions */
import type { Caller, CallReturn, Func } from '@shared/actions'

import { maybeInitializeApp } from '@/connection'

const { functions } = maybeInitializeApp()

const shouldLog = process.env.CLIENT_LOG_API_REQUESTS === 'yes'

export function callWrap<F extends Func>(name: string): Caller<F> {
    const randId = Math.random().toString().slice(2, 6)
    if (shouldLog) { console.log(`calling ${name}#${randId} at ${new Date().toLocaleTimeString()}`) }
    const doCall: Caller<F> = async (...args) => {
        try {
            const startTime = Date.now()
            // TODO: fetch
            // const res = await httpsCallable(functions, name)(args)
            const res = null as unknown as CallReturn<F>
            if (shouldLog) { console.log(`function ${name}#${randId} took ${(Date.now() - startTime) / 1000} seconds and  returned ${JSON.stringify(res)} at ${new Date().toLocaleTimeString()}`) }
            return res
        } catch (e) {
            console.error(`server error: ${e}`)
            return { status: 'error', message: 'error connecting to server' }
        }
    }
    return doCall
}
