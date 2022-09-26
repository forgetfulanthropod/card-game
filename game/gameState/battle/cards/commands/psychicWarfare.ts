import type { BattleCursor, Card, CardUid, CharacterMeta } from 'shared'
import { getDamage } from '../../util/applyDamage'
import { evalAll, evalAllAsHtml } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage } from '@/gameState'

export const explain: Explainers['psychicWarfare'] = (dslArgs, context) => {
    const [damageHtml, sameTargetAddendHtml] = evalAllAsHtml(dslArgs)
    const [damage, sameTargetAddend] = evalAll(dslArgs)
    return `deals ${damageHtml.split('>')[0]}>${getDamageWithAdditional({
        damage,
        attacker: context.characterMeta,

        sameTargetAddend,
        cardUid: (context.command as Card).uid,
        scene: context.scene,
    })}</${
        damageHtml.split('</')[1]
    } damage<br/> +${sameTargetAddendHtml} damage each time used`
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
    const attacker = scene.get('allCharacters', command.characterUid)

    targetUids.forEach(targetUid =>
        applyDamage({
            damage: getDamageWithAdditional({
                damage,
                attacker,
                sameTargetAddend,
                cardUid,
                scene,
            }),
            targetUid,
            attackerUid: command.characterUid,
            scene,
        })
    )
}

function getDamageWithAdditional({
    damage,
    attacker,
    sameTargetAddend,
    cardUid,
    scene,
}: {
    damage: number
    attacker: CharacterMeta
    sameTargetAddend: number
    cardUid: CardUid
    scene?: BattleCursor
}): number {
    return (
        getDamage({
            damage,
            attacker,
            target: null,
        }) + getAdditionalDamage(sameTargetAddend, cardUid, scene)
    )
}

function getAdditionalDamage(
    sameTargetAddend: number,
    cardUid: CardUid,
    scene?: BattleCursor
) {
    if (scene == null) return 0

    const cardsPlayed = scene.get('cardsPlayedThisRoom')

    return (
        Math.ceil(sameTargetAddend) *
        cardsPlayed.filter(c => c.uid === cardUid).length
    )
}
