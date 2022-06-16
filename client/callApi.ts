import type { ActionName, AllActionArgs } from 'shared'

export async function callApi<K extends ActionName>(
    method: K,
    args: AllActionArgs[K]
): Promise<void> {
    // console.log('calling', method, args)
    const username = localStorage.getItem('username')
    if (username == null)
        throw Error(
            `call to ${method}: No username in localstorage. Can't call API.`
        )

    const fullArgs = { ...(args ?? {}), username, method: method }
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
        if ('status' in json) return
        console.warn(`call to ${method}: server returned invalid data`)
    } catch (e) {
        console.warn(
            `call to ${method}: server is offline or did not return json`
        )
    }
}
