import type { ServerActions, BareServerActionsMeta } from 'shared'
import { emitCallApi } from './socket'

export async function callServerApi<K extends keyof ServerActions>(
    method: K,
    args: BareServerActionsMeta[K]['args']
    //@ts-expect-error
): BareServerActionsMeta[K]['res'] {
    try {
        const res = (await emitCallApi({
            method,
            data: args,
        })) as BareServerActionsMeta[K]['res']
        console.log('server api response', res)
        return res
    } catch (e) {
        const err = e as Error
        console.error(`server api error: ${err.message}`)
    }
}
