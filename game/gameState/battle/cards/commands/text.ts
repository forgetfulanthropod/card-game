import type { Value as VAngu } from 'angu'

import type { ExecuteArgs } from './util'

export function explain(text: VAngu) {
    return text.eval()
}

export function execute(_: ExecuteArgs) {
    // do nothing
}
