import * as all from 'game/actions'

import { onCallWrapper } from './onCallWrapper'

const noCommit: unknown[] = [all.hello, all.maybeMakeUser]
const wholeRequests: unknown[] = [all.maybeMakeUser]

export function attachAPIRoutes(): void {
    vals(all).forEach(f =>
        // @ts-ignore
        onCallWrapper(f, {
            disableCommit: noCommit.includes(f),
            wholeRequest: wholeRequests.includes(f),
        })
    )
}

function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
