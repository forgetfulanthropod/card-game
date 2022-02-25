import type { Value as VAngu } from 'angu'

import type { ExecuteArgs } from './util/types'

export function explain(orbTypeAngu: VAngu, numCountersAngu: VAngu) {
    const orbType = orbTypeAngu.eval() as OrbType
    const numCounters = numCountersAngu.eval() as number

    return `creates ${numCounters} ${orbType} orbs`
}

type OrbType = 'lightning' | 'ice'

export function execute({
    dslArgs: [orbTypeAngu, numCountersAngu],
    card,
    targetUids,
    scene,
}: ExecuteArgs) {
    const orbType = orbTypeAngu.eval() as OrbType
    const numCounters = numCountersAngu.eval() as number

    void orbType
    void numCounters
}
