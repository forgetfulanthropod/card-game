import { onCallWrapper, vals } from '@/util'

import * as all from './actions'

const noCommit: unknown[] = [all.hello, all.maybeMakeUser]
const noUserPack: unknown[] = [all.maybeMakeUser]

export function attachAPIRoutes(): void {
    vals(all).forEach(
        f => onCallWrapper(f, {
            disableCommit: noCommit.includes(f),
            disableUsername: noUserPack.includes(f),
        })
    )
}
