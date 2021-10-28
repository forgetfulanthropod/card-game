import { onCallWrapper, vals } from '@/util'

import * as all from './actions'

// @index('./**/*.func.ts', f => `export { default as ${(f.name)} } from '${f.path}'`)


export function attachAPIRoutes(): void {

    vals(all).forEach(
        // @ts-expect-error
        f => onCallWrapper(f)()
    )

}
