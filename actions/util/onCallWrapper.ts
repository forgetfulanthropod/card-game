import { app } from '../index'
const config = {
    log: false,
}

function makeRandId() { return Math.random().toString().slice(2, 6) }
export type HttpsFunction = unknown
const https = {
    onRequest(u: unknown) {
        // TODO
    }
}
export function onCallWrapper<Args, ReturnType>(f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>)): void {
    app.get('/' + f.name, async (request, response) => {
        const randId = makeRandId()
        if (config.log) { console.log(`received call to ${f.name}#${randId} with ${JSON.stringify(request.query)}`) }
        try {
            const result = await f(request.query as unknown as Args)
            if (config.log) { console.log(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`) }
            response.send({ status: 'success', result })
        } catch (e) {
            console.error(`exception occured in client call to ${f.name}: `, e)
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}
