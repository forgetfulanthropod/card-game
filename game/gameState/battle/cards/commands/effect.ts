import { startCase } from 'lodash'
import type {
    BasicTargetType,
    BattleCursor,
    CharacterUid,
    Command,
    EffectId,
} from 'shared'
import { setAt } from 'shared/code'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['effect'] = dslArgs => {
    const [id, increase] = evalAllAsHtml(dslArgs)
    return `+${increase} <b>${startCase(id)}</b>`
}

export const execute: Executors['effect'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase] = evalAll(dslArgs)
    const targetUids = getTargetUids(dslArgs, givenUids, command, scene)

    // logger.info(`adding effect ${id}`)

    applyEffect(scene, targetUids, id, increase)
}

export function applyEffect(
    scene: BattleCursor,
    targetUids: CharacterUid[],
    id: EffectId,
    increase: number
) {
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
    let targetUids

    if (targetType == null) {
        targetUids = givenUids
        if (givenUids.length === 0 && typeof command.targetType === 'string')
            targetType = command.targetType as BasicTargetType
    }
    if (targetType == null) {
        targetUids = givenUids
    } else if (['allFriends', 'allEnemies'].includes(targetType)) {
        const ac = scene.get('allCharacters')
        const isPcSource = ac[command.characterUid].isPc
        const shouldBePc = isPcSource === (targetType === 'friends') // NOR
        targetUids = Object.values(ac)
            .filter(x => x.isPc === shouldBePc)
            .map(x => x.uid)
    } else if (['self'].includes(targetType)) {
        targetUids = [command.characterUid]
    } else {
        targetUids = givenUids
    }
    return targetUids
}
