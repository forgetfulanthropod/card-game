import type { BattleCursor, CharacterUid, Command } from 'shared'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['heal'] = dslArgs => {
    const [amount] = evalAllAsHtml(dslArgs)
    return `heal for ${amount}`
}

export const execute: Executors['heal'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [amount] = evalAll(dslArgs)
    const targetUids = getTargetUidsHeal(dslArgs, givenUids, command, scene)
    targetUids.forEach(uid => {
        const characterCursor = scene.select('allCharacters', uid)

        characterCursor
            .select('health')
            .apply(h =>
                Math.min(
                    h + Math.ceil(amount),
                    characterCursor.get('constitution')
                )
            )
    })
}

function getTargetUidsHeal(
    dslArgs: VAngu[],
    givenUids: CharacterUid[],
    command: Command,
    scene: BattleCursor
) {
    let targetType = evalAll(dslArgs)[1]

    return getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids,
    })
}
