import type { Value as VAngu } from 'angu'

import type { ExecuteArgs } from './util'

export function explain(rounds: VAngu) {
    if (rounds == null) throw new Error('no number of rounds passed in!')

    const n = rounds.eval()
    return `target receives ${n} block`
}

export function execute({
    dslArgs: [blockAgnu],
    targetUids,
    scene,
}: ExecuteArgs) {
    const block = blockAgnu.eval() as number

    scene.apply(['allCharacters', targetUids[0], 'block'], b => b + block)
}
