import type { ActionName, AllActionArgs } from 'shared'

export async function callApi<K extends ActionName>(
    method: K,
    args: AllActionArgs[K]
): Promise<void> {
    // console.log('calling', method, args)
    const username = localStorage.getItem('username')
    if (username == null) {
        // toastWarn(
        //     `call to ${method}: No username in localstorage. Can't call API.`
        // )
        return
    }

    const fullArgs = { ...(args ?? {}), username, method: method }
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
        if (json?.status == null) {
            // toastWarn(`${method} invalid return type`)
            return
        }
        if (json?.status === 'error') {
            // toastWarn(`${method}: server error: ${json?.message}`)
        }
    } catch (e) {
        // toastWarn(`call to ${method}: server is offline or did not return json`)
    }
}
