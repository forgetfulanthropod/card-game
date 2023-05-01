import { startCase } from 'lodash'
import {
    BasicTargetType,
    BattleCursor,
    CharacterUid,
    Command,
    EffectId,
    effectIds,
    procEffectIds,
    ProcEffectId,
} from 'shared'
import { setAt } from 'shared/code'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'
import { getTargetText } from './util/getTargetText'
import { activateSouvenir, activateSouvenirs } from '../../activateSouvenirs'

export const explain: Explainers['effect'] = (dslArgs, context) => {
    const [id, increase, _] = evalAllAsHtml(dslArgs)
    const [__, ___, targetTypeArg, double] = evalAll(dslArgs)
    const targetType = targetTypeArg ?? context.command.targetType

    const effectName = startCase(id).replace('Debuff', '').replace('Buff', '')
    const targetText = getTargetText(targetType, context.characterMeta)

    return double
        ? `Double the amount of Poison counters on ${targetText}.  If no poison counters, it receives <b>${effectName}</b>&nbsp;(${increase}).`
        : `${targetText} gains <b>${effectName}</b>&nbsp;(${increase})`
}

export const execute: Executors['effect'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase, targetTypeOverride, double] = evalAll(dslArgs)

    const targetUids = getTargetUidsOverride({
        targetTypeOverride,
        scene,
        command,
        givenUids,
    })

    applyEffect(scene, targetUids, id, increase, double)
}

export function applyEffect(
    scene: BattleCursor,
    targetUids: CharacterUid[],
    idPartial: EffectId,
    increase: number,
    double?: boolean
) {
    let increaseInt = Math.round(increase)
    const id: EffectId = effectIds.includes(idPartial)
        ? idPartial
        : effectIds[
              effectIds
                  .map(id => id.replace('Debuff', '').replace('Buff', ''))
                  .indexOf(idPartial)
          ]

    if (!id) {
        logger.warn(`couldn't find effect from partial ${idPartial}`)
        return
    }

    const ac = scene.select('allCharacters')

    for (const uid of targetUids) {
        ac.select(uid, 'effects').apply(effects => {
            const i = effects.findIndex(e => e.id === id)
            let effect
            let countType = procEffectIds.includes(id as ProcEffectId)
                ? 'proc'
                : 'turn'
            if (id.endsWith('Debuff')) {
                const h = effects.findIndex(e => e.id === 'hypochondriac')
                if (h !== -1 && effects[h].counter > 0) {
                    effect = {
                        ...effects[h],
                        counter: effects[h].counter - 1,
                    }
                    return setAt(effects, h, effect)
                }
            }
            if (i === -1) {
                effect = {
                    id,
                    counter: increaseInt,
                    countType: countType as 'proc' | 'turn',
                }
            } else {
                effect = {
                    ...effects[i],
                    counter:
                        effects[i].counter > 0 && double
                            ? effects[i].counter * 2
                            : effects[i].counter + increaseInt,
                }
            }
            // activateTalents('effect',
            if (i === -1) return [...effects, effect]
            return setAt(effects, i, effect)
        })
    }
}
