import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalOne } from './util'

export const explain: Explainers['ifTargetDies'] = dslArgs => {
    return `${evalOne(dslArgs[0])}\nif target dies, \n ${evalOne(dslArgs[1])}`
}

export const execute: Executors['ifTargetDies'] = ({
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
