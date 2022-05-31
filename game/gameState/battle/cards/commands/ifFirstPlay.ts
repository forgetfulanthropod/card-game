import type { Value as VAngu } from 'angu'

import type { ExecuteArgs } from './util'

export function explain(...chain: VAngu[]): string {
    return (
        'if first use in room:' +
        chain.map(link => ' - ' + link.eval()).join('\n')
    )
}

export function execute({ dslArgs, scene, cardUid }: ExecuteArgs) {
    if (cardUid == null) throw Error('cardUid is null')

    const thisId = scene.select('cards', 'hand', cardUid).get('id')
    if (!scene.get('cardsPlayedThisRoom').some(c => c.id === thisId)) {
        dslArgs.forEach(a => a.eval())
    }
}
