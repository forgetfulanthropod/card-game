import { onCallWrapper, vals } from '@/util'

import * as all from './actions'


export function attachAPIRoutes(): void {
    vals(all).forEach(
        f => onCallWrapper(f)
    )
}
