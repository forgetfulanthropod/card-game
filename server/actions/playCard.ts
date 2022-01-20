import type { PlayCard } from '@serverActions'
import type { Pile } from '@shared'
import { omit, shuffle } from 'lodash'

import { getBattleScene, keys, vals } from '@/util'

export const playCard: PlayCard = args => {
    // console.log('hello from playCard')
    const scene = getBattleScene(args.username)
    const cards = scene.get('cards')

    const cardIndex = keys(cards.hand).findIndex(
        cardUid => cardUid === args.cardUid
    )
    const card = vals(cards.hand)[cardIndex]

    if (card == null) throw new Error('card Uid not found, something is wrong')

    scene.apply('cards', cards => {
        let draw = cards.draw
        let hand = omit(cards.hand, args.cardUid)
        let discard = { ...cards.discard, ...{ [args.cardUid]: card } }

        if (keys(hand).length === 0)
            ({ draw, hand, discard } = drawNewHand({
                drawPile: draw,
                hand,
                discardPile: discard,
            }))

        // console.log({ ...cards, hand, discard })

        scene.set('cards', cards)
        return { ...cards, draw, hand, discard }
    })
    // commit(scene, args.username)
}

const BASE_HAND_SIZE = 5

function drawNewHand({
    drawPile,
    hand,
    discardPile,
}: {
    drawPile: Pile
    hand: Pile
    discardPile: Pile
}) {
    let newDrawPile = drawPile
    let newHand = {}
    let newDiscardPile = { ...discardPile, ...hand }

    ;({ newDrawPile, newHand } = drawUpToNCards({
        drawPile,
        hand,
        n: BASE_HAND_SIZE,
    }))

    if (keys(newHand).length < BASE_HAND_SIZE) {
        if (keys(newDrawPile).length !== 0)
            throw new Error(
                "the draw pile isn't empty but hand size wasn't achieved"
            )
        ;({ newDrawPile, newHand } = drawUpToNCards({
            drawPile: shufflePile(discardPile),
            hand,
            n: BASE_HAND_SIZE,
        }))

        newDiscardPile = {}
    }

    // let newDrawPile = draw

    return { draw: newDrawPile, hand: newHand, discard: newDiscardPile }
}

function drawUpToNCards({
    drawPile,
    hand,
    n,
}: {
    drawPile: Pile
    hand: Pile
    n: number
}): { newDrawPile: Pile; newHand: Pile } {
    // let postDrawPiles = {drawPile, hand}

    let newDrawPile = drawPile
    let newHand = hand

    const numInHand = keys(hand).length
    const numToDraw = n - numInHand

    if (numToDraw < 0)
        throw new Error(`already have ${numInHand} cards, drawing up to ${n}`)

    if (numToDraw === 0) return { newDrawPile: drawPile, newHand: hand }

    keys(drawPile)
        .slice(0, numToDraw)
        .forEach(drawKey => {
            newHand = { ...newHand, [drawKey]: drawPile[drawKey] }
            newDrawPile = omit(newDrawPile, drawKey)
        })

    return { newDrawPile, newHand }
}

function shufflePile(pile: Pile): Pile {
    let newPile = {}

    shuffle(keys(pile)).forEach(
        pileKey => (newPile = { ...newPile, [pileKey]: pile[pileKey] })
    )

    return newPile
}
