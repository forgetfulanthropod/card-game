import type { AllActionArgs, AllActionRes, AllActions, UserID } from 'shared'
import { emitApiCall } from './socket'

export async function callApi<K extends keyof AllActions>(
    method: K,
    args: AllActionArgs[K]
    //@ts-expect-error
): AllActionRes[K] {
    try {
        console.debug(`Calling API: ${method}`, args)
        const res = await emitApiCall(method, args)
        console.debug('API Response: ', res)
        return res
    } catch (e) {
        const err = e as Error
        console.error(`api error: ${err.message}`)
    }
}
