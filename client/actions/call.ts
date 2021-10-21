/** Exports all the API routes as functions */
import type { Caller, CallReturn, Func } from '@shared/actions'

import { maybeInitializeApp } from '@/connection'
import { entryMap } from '@/util'

const { functions } = maybeInitializeApp()

const shouldLog = process.env.CLIENT_LOG_API_REQUESTS === 'yes'
console.log({ shouldLog })

export function callWrap<F extends Func>(name: string): Caller<F> {
    const randId = Math.random().toString().slice(2, 6)
    const doCall: Caller<F> = async (...args) => {
        if (shouldLog) { console.log(`calling ${name}#${randId} at ${new Date().toLocaleTimeString()}`) }
        try {
            const startTime = Date.now()
            // TODO: fetch
            // const res = await httpsCallable(functions, name)(args)
            const pairs = entryMap(args[0], (k, v) => `${k}=${v}`).join('&')
            const res = await fetch(`http://localhost:3002/${name}?${pairs}`)
            const json = await res.json()
            if (shouldLog) { console.log(`function ${name}#${randId} took ${(Date.now() - startTime) / 1000} seconds and  returned ${JSON.stringify(json)} at ${new Date().toLocaleTimeString()}`) }
            return json
        } catch (e) {
            console.error(`server error: ${e}`)
            return { status: 'error', message: 'error connecting to server' }
        }
    }
    return doCall
}
