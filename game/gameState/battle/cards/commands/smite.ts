import { assertFinite } from 'shared/code'
import { getDamage } from '../../util/applyDamage'
import type { Executors, Explainers } from './util'
import { getOuterHtmlArr, evalAllAsHtml, evalAll } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['smite'] = (dslArgs, context) => {
    const [damageHtml, blockHtml] = evalAllAsHtml(dslArgs)
    const [damage] = evalAll(dslArgs)

    const damageHtmlArr = getOuterHtmlArr(damageHtml)

    return `deal ${damageHtmlArr[0]}${getDamage({
        damage,
        attacker: context.characterMeta,
        target: null,
    })}${damageHtmlArr[1]} damage. If enemy is killed, block ${blockHtml}`
}

export const execute: Executors['smite'] = ({
    command,
    targetUids,
    scene,
    calculatedStats,
}) => {
    if (targetUids.length !== 1)
        throw Error('smite requires exactly one target')
    const targetUid = targetUids[0]
    const healthBefore = scene.get('allCharacters', targetUid).health
    assertFinite({ healthBefore })
    applyDamage({
        damage: calculatedStats.magic,
        targetUid,
        attackerUid: command.characterUid,
        scene,
    })
    const healthAfter = scene.get('allCharacters', targetUid).health
    assertFinite({ healthAfter })
    if (healthAfter <= 0) {
        scene
            .select('allCharacters', command.characterUid, 'block')
            .apply(b => b + Math.ceil(calculatedStats.defense))
    }
}
