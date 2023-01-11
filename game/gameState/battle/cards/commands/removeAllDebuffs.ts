import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calculateStats } from '@/gameState'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'
import { getTargetText } from './util/getTargetText'

export const explain: Explainers['removeAllDebuffs'] = (dslArgs, context) => {
    const [targetTypeOverride] = evalAll(dslArgs)
    return `remove all debuffs from ${getTargetText(
        targetTypeOverride ?? context.command.targetType
    )}`
}

export const execute: Executors['removeAllDebuffs'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [targetTypeOverride] = evalAll(dslArgs)

    const targetUids = getTargetUidsOverride({
        targetTypeOverride,
        scene,
        command,
        givenUids,
    })

    targetUids.forEach(uid =>
        scene
            .select('allCharacters', 'targetUid')
            .apply(cm => ({
                ...cm,
                effects: cm.effects.filter(
                    effect => !effect.id.includes('Debuff')
                ),
            }))
    )
}
