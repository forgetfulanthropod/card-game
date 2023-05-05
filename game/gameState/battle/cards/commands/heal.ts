import type { BattleCursor, CharacterMeta, CharacterUid, Command } from 'shared'
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
        healCharacter(scene, uid, amount)
    })
}

export const healCharacter = (
    scene: BattleCursor,
    characterUid: CharacterUid,
    amount: number,
    percent?: boolean
) => {
    const characterCursor = scene.select('allCharacters', characterUid)
    const constitution = characterCursor.get('calculatedStats', 'constitution')
    characterCursor
        .select('health')
        .apply(h =>
            Math.min(
                h + Math.ceil(percent ? amount * constitution : amount),
                constitution
            )
        )
}
