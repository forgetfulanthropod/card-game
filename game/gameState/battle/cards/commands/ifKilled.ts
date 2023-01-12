import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifKilled'] = dslArgs => {
    // const mainMove = dslArgs[0].eval()
    const [mainMove, conditionalMove] = evalAllAsHtml(dslArgs)
    return `${mainMove}<br/>If target dies, then ${conditionalMove}`
}

export const execute: Executors['ifKilled'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    if (targetUids.length !== 1) {
        logger.error('ifKilled requires exactly one target')
        throw Error()
    }
    const targetUid = targetUids[0]
    const healthBefore = scene.get('allCharacters', targetUid).health
    assertFinite({ healthBefore })
    if (healthBefore <= 0) {
        logger.warn(
            'ifKilled: target already died before executing first argument'
        )
    }
    const mainMove = dslArgs[0]
    mainMove.eval()
    const healthAfter = scene.get('allCharacters', targetUid).health
    assertFinite({ healthAfter })
    if (healthAfter <= 0) {
        const conditionalMove = dslArgs[1]
        conditionalMove.eval()
    }
}
