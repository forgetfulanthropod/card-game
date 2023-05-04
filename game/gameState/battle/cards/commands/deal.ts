import { getDamage } from '../../util/applyDamage'
import { evalAll, evalAllAsHtml, getOuterHtmlArr } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage } from '@/gameState'
import { upperFirst } from 'lodash'
import { getTargetText } from './util/getTargetText'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'
import { miscTauntValues } from 'shared/code'

export const explain: Explainers['deal'] = (dslArgs, context) => {
    const [damageHtml] = evalAllAsHtml(dslArgs)
    const [damage, modifier, targetType] = evalAll(dslArgs)

    const damageHtmlArr = getOuterHtmlArr(damageHtml)

    let explication = `deal ${damageHtmlArr[0]}${getDamage({
        scene: context.scene,
        damage: damage,
        attacker: context.characterMeta,
        target: null,
    })}${damageHtmlArr[1]} damage`

    explication +=
        ' to ' +
        getTargetText(
            targetType ?? context.command.targetType,
            context.characterMeta
        )

    if (modifier) explication += ` <b>${upperFirst(modifier)}</b>`

    return explication
}

export const execute: Executors['deal'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const [damage, modifier, targetType] = evalAll(dslArgs)
    const expectedNumTargets = command.targetNum
    if (expectedNumTargets > -1 && expectedNumTargets !== targetUids.length) {
        logger.error(
            `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
        )
        return
    }

    let totalDamage = 0
    getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids: targetUids,
    }).forEach(
        targetUid =>
            (totalDamage += applyDamage({
                scene,
                damage,
                targetUid,
                attackerUid: command.characterUid,
                piercing: modifier === 'piercing',
                cardId: command.id,
            }))
    )
    if (totalDamage > 20) {
        scene.apply(
            ['allCharacters', command.characterUid, 'taunt'],
            t => t + miscTauntValues['over20dmg']
        )
    }
}
