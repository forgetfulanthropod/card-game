import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['addBlockToSelf'] = dslArgs => {
    const [block] = evalAllAsHtml(dslArgs)
    return `+${block} block to self`
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
