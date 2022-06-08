import type { Executors, Explainers } from './util'

export const explain: Explainers['ifFirstPlay'] = dslArgs => {
    return (
        '\nif first use in room:\n ' +
        dslArgs.map(link => `${link.eval()}`).join('\n')
    )
}

export const execute: Executors['ifFirstPlay'] = ({
    dslArgs,
    scene,
    cardUid,
}) => {
    if (cardUid == null) throw Error('cardUid is null')

    const thisId = scene.select('cards', 'hand', cardUid).get('id')
    if (!scene.get('cardsPlayedThisRoom').some(c => c.id === thisId)) {
        dslArgs.forEach(a => a.eval())
    }
}
