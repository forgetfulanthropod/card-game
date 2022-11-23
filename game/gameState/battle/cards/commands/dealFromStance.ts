import { getDamage } from '../../util/applyDamage'
import { evalAll, evalAllAsHtml } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['dealFromStance'] = (dslArgs, context) => {
    const [_, damageHtml, times] = evalAllAsHtml(dslArgs)
    const [stanceId, damage] = evalAll(dslArgs)
    // logger.info(
    //     JSON.stringify({
    //         damage: damageHtml,
    //         attacker: context.characterMeta,
    //         target: null,
    //     })
    // )
    // logger.info(`damageHtml: ${damageHtml}`)

    const attacker = { ...context.characterMeta, stance: stanceId }

    const damageHtmlArr =
        damageHtml.split('>').length > 1
            ? [damageHtml.split('>')[0] + '>', '</' + damageHtml.split('</')[1]]
            : ['', '']

    // logger.info(`damageHtmlArr: ${damageHtmlArr}`)

    let explication = `deal ${damageHtmlArr[0]}${getDamage({
        damage: damage,
        attacker,
        target: null,
    })}${damageHtmlArr[1]} damage`

    if (times != null) {
        explication += ` ${times} times`
    }

    return explication
}

export const execute: Executors['dealFromStance'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const [stanceId, damage, _times] = evalAll(dslArgs)
    const expectedNumTargets = command.targetNum
    if (expectedNumTargets !== targetUids.length) {
        logger.error(
            `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
        )
        return
    }

    targetUids.forEach(targetUid =>
        applyDamage({
            damage,
            targetUid,
            attacker: {
                ...scene.get('allCharacters', command.characterUid),
                stance: stanceId,
            },
            scene,
        })
    )
}
