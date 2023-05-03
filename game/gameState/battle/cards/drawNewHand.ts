import type { BattleCursor, Pile } from 'shared'
import { updateHand } from './cardManagement'
import { shufflePile } from './shufflePile'
import { activateSouvenirs } from '../activateSouvenirs'
import { omit } from 'lodash'
import { activateTalents, activateTalentsData } from '../Talents'

export function drawNewHand(scene: BattleCursor): void {
    drawCards(scene, scene.get('handSize'))
    activateSouvenirs('postDrawHand', scene)
    activateTalents({ scene, key: 'postDrawHand' })
    updateHand(scene)
    scene.set('handSize', scene.get('baseHandSize'))
}

export const drawCards = (scene: BattleCursor, numCards: number) => {
    for (let i = 0; i < numCards; i++) {
        drawCard(scene)
    }
}

export const drawCard = (
    scene: BattleCursor,
    hand?: Pile,
    draw?: Pile,
    discard?: Pile
) => {
    if (!hand || !draw || !discard)
        ({ hand, draw, discard } = scene.get('cards'))
    let drawKey = Object.keys(draw)[0]
    if (!drawKey) return false
    let nextCard = draw[drawKey]
    nextCard = activateTalentsData({
        scene,
        key: 'drawCardPreAdd',
        data: nextCard,
    })
    hand = { ...hand, [drawKey]: nextCard }
    // delete cards.draw[drawKey]
    draw = omit(draw, drawKey)
    scene.set(['cards', 'hand'], hand)
    scene.set(['cards', 'draw'], draw)
    // TODO activate any on draw card actions here
    activateSouvenirs('drawCard', scene)
    activateTalents({
        scene,
        key: 'drawCard',
        extra: { card: nextCard },
    })
    // TODO DISCUSSION: should scene be mutable
    ;({ hand, draw, discard } = scene.get('cards'))
    if (Object.keys(draw).length === 0) {
        draw = shufflePile(discard)
        discard = {}
        scene.set(['cards', 'draw'], draw)
        scene.set(['cards', 'discard'], discard)
        activateSouvenirs('shuffleDiscard', scene)
        activateTalents({ scene, key: 'shuffleDiscard' })
        ;({ hand, draw, discard } = scene.get('cards'))
    }
    return nextCard
}
