import { onCallWrapper, vals } from '@/util'

import * as all from './actions'


export function attachAPIRoutes(): void {
    vals(all).forEach(
        // @ts-expect-error
        f => onCallWrapper(f)
    )
}
