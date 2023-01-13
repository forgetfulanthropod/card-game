import { getDamage } from '../../util/applyDamage'
import { evalAll, evalAllAsHtml, getOuterHtmlArr } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage } from '@/gameState'
import { upperFirst } from 'lodash'

export const explain: Explainers['deal'] = (dslArgs, context) => {
    const [damageHtml, modifier] = evalAllAsHtml(dslArgs)
    const [damage] = evalAll(dslArgs)

    const damageHtmlArr = getOuterHtmlArr(damageHtml)

    let explication = `deal ${damageHtmlArr[0]}${getDamage({
        damage: damage,
        attacker: context.characterMeta,
        target: null,
    })}${damageHtmlArr[1]} damage`

    if (context.command.targetType === 'allEnemies') {
        explication += ' to all enemies'
    } else {
        explication += ' to target'
    }

    if (modifier) explication += ` <b>${upperFirst(modifier)}</b>`

    return explication
}

export const execute: Executors['deal'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const [damage, modifier] = evalAll(dslArgs)
    const expectedNumTargets = command.targetNum
    if (expectedNumTargets > -1 && expectedNumTargets !== targetUids.length) {
        logger.error(
            `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
        )
        return
    }

    targetUids.forEach(targetUid =>
        applyDamage({
            damage,
            targetUid,
            attackerUid: command.characterUid,
            scene,
            piercing: modifier === 'piercing',
        })
    )
}
