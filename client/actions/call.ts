import type { CallReturn, ActionName, AllActionArgs } from 'shared'

export async function callApi<K extends ActionName>(
    name: K,
    args: AllActionArgs[K]
): Promise<CallReturn> {
    const username = localStorage.getItem('username')
    console.log(`callApi: username: ${username}`)
    if (username == null)
        throw Error("No username in localstorage. Can't call API.")

    const fullArgs = { ...(args ?? {}), username, method: name }
    try {
        const res = await fetch(`api`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullArgs),
        })
        const json = await res.json()
        if ('status' in json) return json as CallReturn
        const message = 'server returned invalid data'
        console.warn(message)
        return { status: 'error', message }
    } catch (e) {
        const message = 'server is offline or did not return json'
        console.warn(message)
        return { status: 'error', message }
    }
}
