import { actions } from 'game'
const all = [...vals(actions), maybeMakeUser]

import { maybeMakeUser } from './maybeMakeUser'
import { onCallWrapper } from './onCallWrapper'
const noCommit: unknown[] = [actions.hello, maybeMakeUser]
const wholeRequests: unknown[] = [maybeMakeUser]

export function attachAPIRoutes(): void {
    all.forEach(f =>
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
