import type {
    ServerActions,
    BareServerActionsMeta,
} from 'shared'

export async function callServerApi<K extends keyof ServerActions>(
    method: K,
    args: BareServerActionsMeta[K]['args']
): Promise<BareServerActionsMeta[K]['res']> {
    const fullArgs = { ...(args ?? {}), method: method }
    console.log('Calling Server API: ', { args, method })

    try {
        const res = await fetch(`server/api`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullArgs),
        })
        const json = (await res.json()) as BareServerActionsMeta[K]['res']
        console.log('Server API Response: ', json)
        return json
    } catch (e) {
        console.error(e)
    }
}
