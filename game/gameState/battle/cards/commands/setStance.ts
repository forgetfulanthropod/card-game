import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calculateStats } from '@/gameState'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'
import { getTargetText } from './util/getTargetText'
import { miscTauntValues } from 'shared/code'

export const explain: Explainers['setStance'] = (dslArgs, context) => {
    const [stance, targetTypeOverride] = evalAll(dslArgs)
    return `Set the stance of ${getTargetText(
        targetTypeOverride ?? context.command.targetType,
        context.characterMeta
    )} to ${stance} (even&nbsp;if&nbsp;locked)`
}

export const execute: Executors['setStance'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [stance, targetTypeOverride] = evalAll(dslArgs)

    const targetUids = getTargetUidsOverride({
        targetTypeOverride,
        scene,
        command,
        givenUids,
    })

    targetUids
        .filter(
            uid =>
                !scene
                    .get('allCharacters', uid, 'effects')
                    .find(e => e.id === 'lockStanceDebuff')
        )
        .forEach(uid =>
            scene.select('allCharacters', uid).apply(cm => ({
                ...cm,
                stance,
                taunt:
                    cm.taunt + stance === 'aggressive'
                        ? miscTauntValues['aggressive']
                        : stance === 'avoidant'
                        ? miscTauntValues['avoidant']
                        : 0,
            }))
        )
}
