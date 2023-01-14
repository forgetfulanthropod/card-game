import { startCase } from 'lodash'
import {
    BasicTargetType,
    BattleCursor,
    CharacterUid,
    Command,
    EffectId,
    effectIds,
} from 'shared'
import { setAt } from 'shared/code'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['effect'] = dslArgs => {
    const [id, increase, targetType] = evalAllAsHtml(dslArgs)
    return `+${increase} <b>${startCase(id)
        .replace('Debuff', '')
        .replace('Buff', '')}</b>${
        targetType ? ' to ' + startCase(targetType).toLowerCase() : ''
    }`
}

export const execute: Executors['effect'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase] = evalAll(dslArgs)
    const targetUids = getTargetUids(dslArgs, givenUids, command, scene)

    applyEffect(scene, targetUids, id, increase)
}

export function applyEffect(
    scene: BattleCursor,
    targetUids: CharacterUid[],
    idPartial: EffectId,
    increase: number
) {
    const id: EffectId = effectIds.includes(idPartial)
        ? idPartial
        : effectIds[
              effectIds
                  .map(id => id.replace('Debuff', '').replace('Buff', ''))
                  .indexOf(idPartial)
          ]

    if (!id) {
        logger.warn(`tried to apply invalid effect ${id}`)
        return
    }

    const ac = scene.select('allCharacters')

    for (const uid of targetUids) {
        ac.select(uid, 'effects').apply(effects => {
            const i = effects.findIndex(e => e.id === id)
            if (i === -1) return [...effects, { id, counter: increase }]
            return setAt(effects, i, {
                ...effects[i],
                counter: effects[i].counter + increase,
            })
        })
    }
}

function getTargetUids(
    dslArgs: VAngu[],
    givenUids: CharacterUid[],
    command: Command,
    scene: BattleCursor
) {
    let targetType = evalAll(dslArgs)[2]

    return getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids,
    })
}
