import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'

export const explain: Explainers['ifTargetDied'] = dslArgs => {
    const conditionalMove = dslArgs[1].toString()
    return `if target dies, then ${conditionalMove}`
}

export const execute: Executors['ifTargetDied'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    if (targetUids.length !== 1)
        throw Error('ifTargetDied requires exactly one target')
    const targetUid = targetUids[0]
    const healthBefore = scene.get('allCharacters', targetUid).health
    assertFinite({ healthBefore })
    if (healthBefore <= 0) {
        logger.warn(
            'ifTargetDied: target already died before executing first argument'
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
