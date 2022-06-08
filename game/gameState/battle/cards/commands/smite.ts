import { assertFinite } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalOne } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['smite'] = dslArgs => {
    return `${evalOne(dslArgs[0])}\nif target dies, \n ${evalOne(dslArgs[1])}`
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
        multiplier: 1,
        scene,
        targetUid,
    })
    const healthAfter = scene.get('allCharacters', targetUid).health
    assertFinite({ healthAfter })
    if (healthAfter <= 0) {
        scene
            .select('allCharacters', command.characterUid, 'block')
            .apply(b => b + calculatedStats.dexterity)
    }
}
