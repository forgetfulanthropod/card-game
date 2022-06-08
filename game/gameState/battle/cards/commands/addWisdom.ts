import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['addWisdom'] = dslArgs => {
    const [wisdom] = evalAll(dslArgs)
    return `+${wisdom} wisdom`
}

export const execute: Executors['addWisdom'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [wisdom] = evalAll(dslArgs)

    scene.apply(['allCharacters', targetUids[0], 'wisdom'], w => w + wisdom)
}
