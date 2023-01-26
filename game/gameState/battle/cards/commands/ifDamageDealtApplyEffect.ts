import { assertFinite } from 'shared/code'
import {
    getLivingNpcUids,
    getLivingPcUids,
    isPc,
} from '../../characters/characterGetters'
import { applyDamage } from '../../util'
import { applyEffect } from './effect'
import { evalAll, Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifDamageDealtApplyEffect'] = dslArgs => {
    return `ifDamageDealtApplyEffect`
}

export const execute: Executors['ifDamageDealtApplyEffect'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    const [damage, effectId, counter] = evalAll(dslArgs)

    targetUids.forEach(targetUid => {
        const healthBefore = scene.get('allCharacters', targetUid, 'health')
        applyDamage({
            damage,
            targetUid,
            scene,
            attackerUid: command.characterUid,
        })

        const healthAfter = scene.get('allCharacters', targetUid, 'health')

        if (healthBefore !== healthAfter)
            applyEffect(scene, [targetUid], effectId, counter)
    })
}
