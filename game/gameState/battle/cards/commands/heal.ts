import type { BattleCursor, CharacterUid, Command } from 'shared'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'
import { calculateStats } from '../../characters/effects'

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
    const [amount, targetType] = evalAll(dslArgs)

    getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids,
    }).forEach(uid => {
        const characterCursor = scene.select('allCharacters', uid)

        characterCursor
            .select('health')
            .apply(h =>
                Math.min(
                    h + Math.ceil(amount),
                    calculateStats(characterCursor.get()).constitution
                )
            )
    })
}
