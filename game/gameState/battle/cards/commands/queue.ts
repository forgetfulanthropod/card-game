import type { Executors, Explainers } from './util'
import { s } from './util'
import { enqueueAction } from '@/gameState'

export const explain: Explainers['queue'] = dslArgs => {
    const turnsAway = dslArgs[0].eval()
    const nextAction = dslArgs[1].toString()
    // TODO: proper explainer
    return `in ${turnsAway} turn${s(turnsAway)}: ${nextAction}`
}

export const execute: Executors['queue'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    const turnsAway = dslArgs[0].eval()
    const nextAction = dslArgs[1].toString()

    const side = scene.get('allCharacters', command.characterUid, 'isPc')
        ? 'pc'
        : 'npc'
    enqueueAction(
        {
            actions: nextAction,
            characterUid: command.characterUid,
            turnsAway,
            targetUids,
            side,
        },
        scene
    )
}
