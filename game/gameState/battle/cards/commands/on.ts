import produce from 'immer'
import { startCase } from 'lodash'
import { evalAll, Executors, Explainers } from './util'

export const explain: Explainers['on'] = dslArgs => {
    const [commandHookId, nextAction] = evalAll(dslArgs)

    return `on ${startCase(commandHookId)}, ${nextAction}`
}

export const execute: Executors['on'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
    cardUid,
}) => {
    const commandHookId = dslArgs[0].eval()
    const onceOnly = dslArgs[2].eval() === 'once'

    scene.apply(
        'on',
        produce(on => {
            const commandsQueuedForHook = on[commandHookId] ?? []

            commandsQueuedForHook.push({
                description: command.name,
                command: {
                    //@ts-expect-error
                    uid: cardUid,
                    id: command.id,
                    name: command.name,
                    targetNum: command.targetNum,
                    targetType: command.targetType,
                    actions: dslArgs[1].toString(),
                    characterUid: command.characterUid,
                },
                targetUids,
                turnsAway: onceOnly ? 0 : 1,
                side: 'pc',
            })

            on[commandHookId] = commandsQueuedForHook
        })
    )
}
