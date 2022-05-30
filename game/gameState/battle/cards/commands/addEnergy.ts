import type { Value as VAngu } from 'angu'
import { notnull } from 'shared/code'

import type { ExecuteArgs } from './util'

export function explain(amount: VAngu) {
    notnull({ amount })

    const n = amount.eval()
    return `+${n} energy`
}

export function execute({ dslArgs: [amount], scene }: ExecuteArgs) {
    const energy = amount.eval() as number

    scene.apply('energy', e => e + energy)
}
