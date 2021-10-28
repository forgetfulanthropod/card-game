import { onCallWrapper, vals } from '@/util'

import * as allFunctions from './funcs'

export function attachAPIRoutes(): void {
    vals(allFunctions).forEach(
        // @ts-ignore TODO: typescript checker is getting confused about which function is getting which arguments
        f => onCallWrapper(f)()
        // f => f()
    )
}
