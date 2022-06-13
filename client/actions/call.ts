import type { Action, CallReturn } from 'shared'

import { jss } from 'shared/code'
import { localTree } from '@/data'

const config = {
    shouldLog: false,
    shouldSaveCalls: true,
}

export async function callApi<K extends keyof Action>(
    name: K,
    args: Parameters<Action[K]>[0]
): Promise<CallReturn<Action[K]> | null> {
    type F = Action[K]
    const randId = Math.random().toString().slice(2, 6)
    if (config.shouldSaveCalls) {
        localTree.select('serverCalls').apply(calls => [
            ...calls,
            {
                name,
                args: args,
                time: new Date().toLocaleTimeString(),
            },
        ])
    }
    if (config.shouldLog) {
        console.log(
            jss`calling ${name}#${randId}(${args}) at ${new Date().toLocaleTimeString()}`
        )
    }
    try {
        const username = localStorage.getItem('username')
        console.log(`callApi: username: ${username}`)
        if (username == null)
            throw Error("No username in localstorage. Can't call API.")

        const fullArgs = { ...(args ?? {}), username, method: name }
        const startTime = Date.now()
        let json: CallReturn<F> | null = null
        const res = await fetch(`api`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullArgs),
        })

        try {
            json = await res.json()
        } catch (e) {
            console.log(`${name}#${randId} did not return json`)
        }
        if (config.shouldLog) {
            console.log(
                `function ${name}#${randId} took ${
                    (Date.now() - startTime) / 1000
                } seconds and  returned ${JSON.stringify(
                    json
                )} at ${new Date().toLocaleTimeString()}`
            )
        }
        return json
    } catch (e) {
        console.error(`server error: ${e}`)
        return { status: 'error', message: 'error connecting to server' }
    }
}
