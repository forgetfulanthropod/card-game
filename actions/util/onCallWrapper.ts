import type { HttpsFunction } from 'firebase-functions/v1'
import { https } from 'firebase-functions/v1'


const config = {
    log: false,
}

function makeRandId() { return Math.random().toString().slice(2, 6) }

export function onCallWrapper<Args, ReturnType>(f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>)): HttpsFunction {
    // startFirebaseApp()
    return https.onCall(async (data, _context) => {
        const randId = makeRandId()
        const startTime = Date.now()
        if (config.log) { console.log(`received call to ${f.name}#${randId} with ${JSON.stringify(data[0])}`) }
        try {
            const result = await f(data[0])
            const elapsed = Date.now() - startTime
            if (config.log) { console.log(`    ${f.name}#${randId} took ${elapsed / 1000} seconds and is responding with ${JSON.stringify(result)}`) }
            return { status: 'success', result }
        } catch (e) {
            console.error(`exception occured in client call to ${f.name}: `, e)
            return { status: 'error', message: JSON.stringify(e) }
        }
    })
}
