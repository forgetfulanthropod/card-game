import { evalAll, Executors, Explainers } from './util'
import { enqueueAction } from '@/gameState'
import { startCase } from 'lodash'

export const explain: Explainers['on'] = dslArgs => {
    const [commandHookId, nextAction] = evalAll(dslArgs)

    return `on ${startCase(commandHookId)}, ${nextAction}`
}

export const execute: Executors['on'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    // const turnsAway = dslArgs[0].eval()
    // const nextAction = dslArgs[1].toString()
}
