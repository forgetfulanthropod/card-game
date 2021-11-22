import { onCallWrapper, vals } from '@/util'

import * as all from './actions'

const noCommit = ['hello']

export function attachAPIRoutes(): void {
    vals(all).forEach(
        f => onCallWrapper(f, { disableCommit: noCommit.includes(f.name) })
    )
}
