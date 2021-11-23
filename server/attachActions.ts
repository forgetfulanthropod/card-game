import { onCallWrapper, vals } from '@/util'

import * as all from './actions'

const noCommit: unknown[] = [all.hello, all.maybeMakeUser]
const wholeRequests: unknown[] = [all.maybeMakeUser]

export function attachAPIRoutes(): void {
    vals(all).forEach(
        f => onCallWrapper(f, {
            disableCommit: noCommit.includes(f),
            wholeRequest: wholeRequests.includes(f),
        })
    )
}
