import type { BattleCursor, CardUid } from 'shared'
import { evalAll, evalAllAsHtml } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['psychicWarfare'] = dslArgs => {
    const [damage, sameTargetAddend] = evalAllAsHtml(dslArgs)
    return `deal ${damage} damage<br/> +${sameTargetAddend} damage each time used`
}

export const execute: Executors['psychicWarfare'] = ({
    dslArgs,
    scene,
    targetUids,
    cardUid,
    command,
}) => {
    const [damage, sameTargetAddend] = evalAll(dslArgs)
    if (cardUid == null) throw new Error('psychic warfare on non-card?')

    targetUids.forEach(targetUid =>
        applyDamage({
            damage:
                damage + getAdditionalDamage(sameTargetAddend, cardUid, scene),
            targetUid,
            attackerUid: command.characterUid,
            scene,
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
