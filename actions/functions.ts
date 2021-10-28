import * as allFunctions from './funcs'
import { vals } from './util'

export function attachAPIRoutes(): void {
    vals(allFunctions).forEach(
        // f => onCallWrapper(f)()
        f => f()
    )
}
