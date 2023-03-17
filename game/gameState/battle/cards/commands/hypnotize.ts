import { Card, CardUid } from 'shared'
import { getCardInstance, updateExplanations } from '../cardManagement'
import { shufflePile } from '../shufflePile'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['hypnotize'] = dslArgs => {
    const [count] = evalAllAsHtml(dslArgs)
    return `add ${count} hypnotized cards to your deck for this room`
}

export const execute: Executors['hypnotize'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [count] = evalAll(dslArgs)
    let hypnoCards: Record<CardUid, Card> = {}
    for (let i = 0; i < count; i++) {
        let newCard = getCardInstance('hypnotized', targetUids[0])
        newCard = updateExplanations(newCard, scene)
        hypnoCards[newCard.uid] = newCard
    }
    scene.select('cards', 'draw').apply(draw => {
        draw = { ...draw, ...hypnoCards }
        return shufflePile(draw)
    })
}
