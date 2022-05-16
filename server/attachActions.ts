import { actions as all } from 'game'

import { maybeMakeUser } from './maybeMakeUser'
import { onCallWrapper } from './onCallWrapper'
const noCommit: unknown[] = [all.hello, maybeMakeUser]
const wholeRequests: unknown[] = [maybeMakeUser]

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
