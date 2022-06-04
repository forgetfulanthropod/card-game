import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['addBlock'] = dslArgs => {
    const [block] = evalAll(dslArgs)
    return `+${block} block`
}

export const execute: Executors['addBlock'] = ({
    dslArgs,
    targetUids,
    scene,
    calculatedStats,
}) => {
    const [block] = evalAll(dslArgs)

    scene.apply(
        ['allCharacters', targetUids[0], 'block'],
        b => b + block * calculatedStats.blockMultiplier
    )
}
