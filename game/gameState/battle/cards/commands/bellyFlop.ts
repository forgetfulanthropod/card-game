import { applyDamage } from '../../util'
import { evalAll, evalAllAsHtml, Executors, Explainers } from './util'

export const explain: Explainers['bellyFlop'] = dslArgs => {
    const [damageHtml] = evalAllAsHtml(dslArgs)

    return `Bosshog Jürgen will attempt to attack for ${damageHtml} damage, but will deal 1 point less for every point of damage he takes.`
}

export const execute: Executors['bellyFlop'] = ({
    scene,
    command,
    targetUids,
    dslArgs,
}) => {
    const [damageBase] = evalAll(dslArgs)
    const damageDealtThisTurn = scene
        .get('damagesDealtThisTurn')
        .filter(damage => damage.targetUid === command.characterUid)
        .reduce((total, d) => total + d.amount, 0)

    const damage = Math.max(1, damageBase - damageDealtThisTurn)

    targetUids.map(targetUid =>
        applyDamage({
            damage,
            targetUid,
            attackerUid: command.characterUid,
            scene,
        })
    )
}
