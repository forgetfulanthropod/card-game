import { applyDamage } from '../../util'
import { evalAll, evalAllAsHtml, Executors, Explainers } from './util'

export const explain: Explainers['bellyFlop'] = dslArgs => {
    const [damageHtml, times] = evalAllAsHtml(dslArgs)
    const timesString = Number(times) > 1 ? ` ${times} times` : ``
    return `Bosshog Jürgen will attempt to attack for ${damageHtml} damage${timesString}, but will deal 1 point less for every point of damage he takes.`
}

export const execute: Executors['bellyFlop'] = ({
    scene,
    command,
    targetUids,
    dslArgs,
}) => {
    const [damageBase, times] = evalAll(dslArgs)
    const damageDealtThisTurn = scene
        .get('damagesDealtThisTurn')
        .filter(damage => damage.targetUid === command.characterUid)
        .reduce((total, d) => total + d.amount, 0)

    const damage = Math.max(1, damageBase - damageDealtThisTurn)

    // attack same target multiple times; bad logic but works for now.
    if (targetUids.length == times) {
        targetUids.map(targetUid =>
            applyDamage({
                damage,
                targetUid,
                attackerUid: command.characterUid,
                scene,
            })
        )
    } else {
        for (let i = 0; i < times; i++) {
            applyDamage({
                damage,
                targetUid: targetUids[0],
                attackerUid: command.characterUid,
                scene,
            })
        }
    }
}
