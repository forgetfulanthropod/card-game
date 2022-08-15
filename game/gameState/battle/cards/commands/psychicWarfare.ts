import type { BattleCursor, CardUid } from 'shared'
import { evalAll } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage, calcPostEffectStats } from '@/gameState'

export const explain: Explainers['psychicWarfare'] = dslArgs => {
    const [damage, sameTargetAddend] = evalAll(dslArgs)
    return `deal ${Math.ceil(damage)} damage\n +${Math.ceil(
        Math.ceil(sameTargetAddend)
    )} damage each time used`
}

export const execute: Executors['psychicWarfare'] = ({
    dslArgs,
    scene,
    targetUids,
    cardUid,
}) => {
    const [damage, sameTargetAddend] = evalAll(dslArgs)
    if (cardUid == null) throw new Error('psychic warfare on non-card?')

    targetUids.forEach(targetUid =>
        applyDamage({
            damage:
                damage + getAdditionalDamage(sameTargetAddend, cardUid, scene),
            targetUid,
            scene,
            multiplier: calcPostEffectStats(
                scene.get('allCharacters', targetUid)
            ).damageTakeMultiplier,
        })
    )
}

function getAdditionalDamage(
    sameTargetAddend: number,
    cardUid: CardUid,
    scene: BattleCursor
) {
    const cardsPlayed = scene.get('cardsPlayedThisRoom')

    return (
        Math.ceil(sameTargetAddend) *
        cardsPlayed.filter(c => c.uid === cardUid).length
    )
}
