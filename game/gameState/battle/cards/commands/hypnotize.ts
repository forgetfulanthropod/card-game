import { Card, CardUid } from 'shared'
import { getCardInstance, updateExplanations } from '../cardManagement'
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
    // let hypnoCards: Record<CardUid, Card> = {}
    let hypnoCards: Card[] = []
    for (let i = 0; i < count; i++) {
        let newCard = getCardInstance('hypnotized', targetUids[0])
        newCard = updateExplanations(newCard, scene)
        hypnoCards.push(newCard)
    }
    scene.select('cards', 'draw').apply(draw => {
        let drawEntries = Object.entries(draw)
        const numInDraw = drawEntries.length
        for (const card of hypnoCards) {
            let idx = Math.floor(Math.random() * (numInDraw + 1))
            drawEntries.splice(idx, 0, [card.uid, card])
        }
        draw = Object.fromEntries(drawEntries)
        return draw
    })
}
