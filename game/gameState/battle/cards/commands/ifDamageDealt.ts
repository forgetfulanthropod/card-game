import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'

export const explain: Explainers['ifDamageDealt'] = dslArgs => {
    // const mainMove = dslArgs[0].eval()
    const conditionalMove = dslArgs[1].toString()
    return `if damage is dealt, then ${conditionalMove}`
}

export const execute: Executors['ifDamageDealt'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    if (targetUids.length !== 1)
        throw Error('ifDamageDealt requires exactly one target')
    const targetUid = targetUids[0]
    const healthBefore = scene.get('allCharacters', targetUid).health
    assertFinite({ healthBefore })
    if (healthBefore <= 0) {
        logger.warn(
            'ifDamageDealt: target already died before executing first argument'
        )
    }
    const mainMove = dslArgs[0]
    mainMove.eval()
    const healthAfter = scene.get('allCharacters', targetUid).health
    assertFinite({ healthAfter })
    if (healthAfter < healthBefore) {
        const conditionalMove = dslArgs[1]
        conditionalMove.eval()
    }
}
