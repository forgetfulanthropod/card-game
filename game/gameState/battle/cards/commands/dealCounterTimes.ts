import { evalAll, evalAllAsHtml } from './util'

import { applyDamage } from '@/gameState'
import type { Executors, Explainers } from './util'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

export const explain: Explainers['dealCounterTimes'] = (dslArgs, context) => {
    const [_, effectCounterMultiplicand] = evalAllAsHtml(dslArgs)
    const [effectId] = evalAll(dslArgs)

    return `deal ${effectCounterMultiplicand} points of damage to target enemy for every ${effectId} counter they have`
}

export const execute: Executors['dealCounterTimes'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const [effectId, effectCounterMultiplicand, targetType] = evalAll(dslArgs)

    getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids: targetUids,
    }).forEach(targetUid => {
        const damage =
            (scene
                .get('allCharacters', targetUid, 'effects')
                .find(e => e.id.includes(effectId))?.counter ?? 0) *
            effectCounterMultiplicand

        applyDamage({
            damage,
            targetUid,
            attackerUid: command.characterUid,
            scene,
        })
    })
}
