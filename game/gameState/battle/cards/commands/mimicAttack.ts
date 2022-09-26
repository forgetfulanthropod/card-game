import { applyDamage } from '../../util'
import type { Executors, Explainers } from './util'

export const explain: Explainers['mimicAttack'] = () => {
    return 'mimics the last attack against this character, otherwise deals 999'
}

export const execute: Executors['mimicAttack'] = ({
    scene,
    command,
    targetUids,
}) => {
    const damagesDealtThisTurn = scene
        .get('damagesDealtThisTurn')
        .filter(damage => damage.targetUid === command.characterUid)
        .reverse()

    let damage = 999
    if (damagesDealtThisTurn.length) damage = damagesDealtThisTurn[0].amount

    applyDamage({
        damage,
        targetUid: targetUids[0],
        attackerUid: command.characterUid,
        scene,
    })
}
