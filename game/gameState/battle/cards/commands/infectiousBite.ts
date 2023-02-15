import { applyDamage } from '../../util'
import { applyEffect } from './effect'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['infectiousBite'] = dslArgs => {
    return 'Mimic attacks for 100%.\nApply <b>Poisoned</b> equal to the amount of unblocked damage.'
}

export const execute: Executors['infectiousBite'] = ({
    scene,
    command,
    targetUids,
    dslArgs,
}) => {
    scene.apply('handSize', h => Number(h) + 1)
    const [damage] = evalAll(dslArgs)
    const unblockedDamage = applyDamage({
        damage,
        targetUid: targetUids[0],
        attackerUid: command.characterUid,
        scene,
    })
    if (unblockedDamage > 0)
        applyEffect(
            scene,
            targetUids,
            'poisonedDebuff',
            Math.ceil(unblockedDamage / 5)
        )
}
