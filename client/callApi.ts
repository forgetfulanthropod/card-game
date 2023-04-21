import type { ActionName, AllActionArgs } from 'shared'
import { emitCallApi } from './socket'
import { getStringFromLocalStorage } from './elementsUtil'
export async function callApi<K extends ActionName>(
    method: K,
    args: AllActionArgs[K]
): Promise<void> {
    try {
        const username = getStringFromLocalStorage('username')
        if (username === null) return
        const res = await emitCallApi({ method, data: args, username })
    } catch (e) {
        const err = e as Error
        console.error(`api error: ${err.message}`)
    }
}
