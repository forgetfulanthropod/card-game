import produce from 'immer'
import {
    BattleCursor,
    CharacterUid,
    CommandHookId,
    CommandHooks,
    QueuedCommand,
} from 'shared'
import { vals } from 'shared/code'
import { interpretCommand } from './cards'

export function triggerOnHook(
    scene: BattleCursor,
    id: CommandHookId,
    commandOwnerUid?: CharacterUid
) {
    // logger.info(
    //     `!!!hey the card has been discarded, triggering hook ${id} now!!! ${JSON.stringify(
    //         scene.get('on')
    //     )}`
    // )

    scene.set(
        'on',
        produce(scene.get('on') ?? {}, (on: CommandHooks) => {
            const remainingCommands = (on[id] ?? [])
                .map(commandDetail => {
                    const { command, targetUids } = commandDetail

                    if (
                        !commandOwnerUid ||
                        command.characterUid === commandOwnerUid
                    )
                        interpretCommand({ command, targetUids, scene }, false)

                    return commandDetail.turnsAway ? commandDetail : null
                })
                .filter(cd => cd != null) as QueuedCommand[]

            if (remainingCommands.length > 0) on[id] = remainingCommands
            else delete on[id]
        })
    )
}

export function clearCommandHooksForTurn(scene: BattleCursor) {
    scene.apply(
        'on',
        produce(on =>
            //@ts-expect-error
            vals(on).forEach(
                queue =>
                    (queue = queue?.filter(
                        commandDetail => commandDetail.turnsAway !== 1
                    ))
            )
        )
    )
}

export function clearCommandHooks(scene: BattleCursor) {
    scene.set('on', {})
}
