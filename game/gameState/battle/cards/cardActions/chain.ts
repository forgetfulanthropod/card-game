import type { Value as VAngu } from 'angu'

import type { ExecuteArgs } from './util'

export function explain(...chain: VAngu[]) {
    return chain.map(link => link.eval()).join('\n')
}

export function execute({ dslArgs }: ExecuteArgs) {
    dslArgs.forEach(a => a.eval())
}
