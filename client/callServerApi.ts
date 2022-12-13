import type { BareServerActionArgs } from 'shared'

export async function callServerApi<K extends keyof BareServerActionArgs>(
    method: K,
    args: BareServerActionArgs[K]
): Promise<void> {
    const fullArgs = { ...(args ?? {}), method: method }
    try {
        const res = await fetch(`server/api`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullArgs),
        })
        const json = await res.json()
        if (json?.status === null || json?.status === 'error') {
            console.error(json?.status)
            return
        }
    } catch (e) {
        console.error(e)
    }
}
