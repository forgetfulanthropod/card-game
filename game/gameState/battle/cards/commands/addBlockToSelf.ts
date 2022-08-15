import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['addBlockToSelf'] = dslArgs => {
    const [block] = evalAll(dslArgs)
    return `+${block} block self`
}

export const execute: Executors['addBlockToSelf'] = ({
    command,
    dslArgs,
    scene,
    calculatedStats,
}) => {
    const [block] = evalAll(dslArgs)

    scene.apply(
        ['allCharacters', command.characterUid, 'block'],
        b => b + block * calculatedStats.blockMultiplier
    )
}
