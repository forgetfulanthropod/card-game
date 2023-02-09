import { evalAll, Executors, Explainers } from './util'
import { enqueueAction } from '@/gameState'

export const explain: Explainers['queue'] = dslArgs => {
    const [turnsAway, nextAction] = evalAll(dslArgs)

    return `${
        turnsAway === 1 ? 'Next turn' : `In ${turnsAway} turns`
    }, ${nextAction}`
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
