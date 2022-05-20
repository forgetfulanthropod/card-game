import { actions } from 'game'

import { makeNewUser as makeNewUser, maybeMakeUser } from './actions'
import { onCallWrapper } from './onCallWrapper'

const all = [...vals(actions), maybeMakeUser, makeNewUser]
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
