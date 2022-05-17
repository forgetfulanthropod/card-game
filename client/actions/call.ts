import type { Action, CallReturn } from 'shared'

import { getClientTree } from '@/data/rootTree'
import { jss } from '@/util'

const config = {
    shouldLog: false,
    method: 'post' as 'get' | 'post',
    shouldSaveCalls: true,
}

export async function callApi<K extends keyof Action>(
    name: K,
    args: Parameters<Action[K]>[0]
): Promise<CallReturn<Action[K]> | null> {
    type F = Action[K]
    const randId = Math.random().toString().slice(2, 6)
    if (config.shouldSaveCalls) {
        getClientTree()
            .select('serverCalls')
            .apply(calls => [
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
        const startTime = Date.now()
        let json: CallReturn<F> | null = null
        if (config.method === 'get') {
            const pairs = Object.entries(args ?? {})
                .map((k, v) => `${k}=${v}`)
                .join('&')
            const res = await fetch(`${name}?${pairs}`)
            json = await res.json()
        } else {
            const res = await fetch(`${name}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(args),
            })

            try {
                json = await res.json()
            } catch (e) {
                console.log(`${name}#${randId} did not return json`)
            }
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
