import type { Executors, Explainers } from './util'
import { getOuterHtmlArr, evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['addBlockToSelf'] = dslArgs => {
    const [blockHtml] = evalAllAsHtml(dslArgs)
    const [block] = evalAll(dslArgs)
    const outerHtmlArr = getOuterHtmlArr(blockHtml)
    return `+${outerHtmlArr[0]}${Math.ceil(block)}${
        outerHtmlArr[1]
    } block to self`
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
