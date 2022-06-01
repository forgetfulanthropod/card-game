import { setAt } from 'shared/code'

import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['effect'] = dslArgs => {
    const [id, increase] = evalAll(dslArgs)
    return `+ ${increase} ${id}`
}

export const execute: Executors['effect'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase, targetType] = evalAll(dslArgs)
    let targetUids = givenUids
    if (targetType) {
        const ac = scene.get('allCharacters')
        const isPcSource = ac[command.characterUid].isPc
        const shouldBePc = isPcSource === (targetType === 'friends') // NOR
        targetUids = Object.values(ac)
            .filter(x => x.isPc === shouldBePc)
            .map(x => x.uid)
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
