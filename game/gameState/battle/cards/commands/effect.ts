import type { Value as VAngu } from 'angu'
import type { EffectId } from 'shared'
import { notnull, setAt } from 'shared/code'

import type { ExecuteArgs } from './util'

export function explain(id: VAngu<string>, increase: VAngu<number>): string {
    notnull({ id, increase })

    return `add ${increase.eval()} to the ${id.eval()} counter`
}

export function execute({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}: ExecuteArgs) {
    if (dslArgs.length < 2) throw Error('id and increase are required')
    const id: EffectId = dslArgs[0].eval()
    const increase: number = dslArgs[1].eval()
    const targetType: 'friends' | 'enemies' | null = dslArgs[2]?.eval() ?? null
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
