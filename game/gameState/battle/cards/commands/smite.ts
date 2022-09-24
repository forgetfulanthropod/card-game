import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['smite'] = dslArgs => {
    const [damage, block] = evalAllAsHtml(dslArgs)

    return `Deal ${damage} damage. If enemy is killed, block ${block}.`
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
        damage: calculatedStats.wisdom,
        targetUid,
        attackerUid: command.characterUid,
        scene,
    })
    const healthAfter = scene.get('allCharacters', targetUid).health
    assertFinite({ healthAfter })
    if (healthAfter <= 0) {
        scene
            .select('allCharacters', command.characterUid, 'block')
            .apply(b => b + calculatedStats.defense)
    }
}
