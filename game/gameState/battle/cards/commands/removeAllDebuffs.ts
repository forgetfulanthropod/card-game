import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calculateStats } from '@/gameState'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'
import { getTargetText } from './util/getTargetText'

export const explain: Explainers['removeAllDebuffs'] = (dslArgs, context) => {
    const [targetTypeOverride] = evalAll(dslArgs)
    return `remove all debuffs from ${getTargetText(
        targetTypeOverride ?? context.command.targetType,
        context.characterMeta
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

    logger.debug(
        'removing all debuffs from uids: ' + targetUids + ' given ' + givenUids
    )

    targetUids.forEach(uid =>
        scene.select('allCharacters', uid).apply(cm => ({
            ...cm,
            effects: cm.effects.filter(effect => !effect.id.includes('Debuff')),
        }))
    )
}
