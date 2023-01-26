import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'
import { enqueueAction } from '@/gameState'

export const explain: Explainers['addEnergyPerRound'] = dslArgs => {
    const [energy] = evalAllAsHtml(dslArgs)

    return `gain ${energy} energy <br/>at the start of each turn`
}

export const execute: Executors['addEnergyPerRound'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    enqueueAction(
        {
            actions: `addEnergy(${dslArgs[0].eval()})`,
            characterUid: command.characterUid,
            turnsAway: -1,
            targetUids,
            side: 'pc',
        },
        scene
    )
}
