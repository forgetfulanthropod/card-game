/** Exports all the API routes as functions */
import type { Caller, Func } from '@shared'

import { entryMap } from '../util'


const config = {
    shouldLog: process.env.CLIENT_LOG_API_REQUESTS === 'yes',
    method: 'post' as 'get' | 'post',
}
console.log('call.ts config:', config)


export function callWrap<F extends Func>(name: string): Caller<F> {
    const randId = Math.random().toString().slice(2, 6)
    const doCall: Caller<F> = async (...args) => {
        if (config.shouldLog) { console.log(`calling ${name}#${randId}(${JSON.stringify(args[0])}) at ${new Date().toLocaleTimeString()}`) }
        try {
            const startTime = Date.now()
            // TODO: fetch
            // const res = await httpsCallable(functions, name)(args)
            let json: ReturnType<F> | null = null
            if (config.method === 'get') {
                const pairs = entryMap(args[0], (k, v) => `${k}=${v}`).join('&')
                const res = await fetch(`/${name}?${pairs}`)
                json = await res.json()
            } else {
                console.log('the body will be:', JSON.stringify(args[0]))
                const res = await fetch(`/${name}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(args[0])
                })

                try {
                    json = await res.json()
                } catch (e) {
                    console.log(`${name}#${randId} did not return json`)
                }
            }
            if (config.shouldLog) { console.log(`function ${name}#${randId} took ${(Date.now() - startTime) / 1000} seconds and  returned ${JSON.stringify(json)} at ${new Date().toLocaleTimeString()}`) }
            return json!
        } catch (e) {
            console.error(`server error: ${e}`)
            return { status: 'error', message: 'error connecting to server' }
        }
    }
    return doCall
}
