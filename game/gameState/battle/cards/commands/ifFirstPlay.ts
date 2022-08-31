import type { Executors, Explainers } from './util'

export const explain: Explainers['ifFirstPlay'] = dslArgs => {
    return (
        '<br/>if first use in room:<br/> ' +
        dslArgs.map(link => `${link.eval()}`).join('<br/>')
    )
}

export const execute: Executors['ifFirstPlay'] = ({
    dslArgs,
    scene,
    cardUid,
}) => {
    if (cardUid == null) throw Error('cardUid is null')

    const thisId = scene.select('cards', 'hand', cardUid).get('id')
    if (thisId == null) throw Error('card is not in hand!')
    if (!scene.get('cardsPlayedThisRoom').some(c => c.id === thisId)) {
        dslArgs.forEach(a => a.eval())
    }
}
