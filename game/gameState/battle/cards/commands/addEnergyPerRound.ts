import type { Executors, Explainers } from './util'
import { enqueueAction } from '@/gameState'

export const explain: Explainers['addEnergyPerRound'] = dslArgs => {
    const energy = dslArgs[0].eval()

    return `adds ${energy} at the start of each turn`
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
