import { omit } from 'lodash'
import type { BattleCursor, Piles, Pile } from 'shared'
import { keys } from 'shared/code'
import { updateHand } from './cardManagement'
import { shufflePile } from './shufflePile'

export function drawNewHand(scene: BattleCursor): void {
    scene.set(
        'cards',
        discardAndDrawAndGetPiles(scene.get('cards'), scene.get('handSize'))
    )
    updateHand(scene)
    scene.set('handSize', scene.get('baseHandSize'))
}

function discardAndDrawAndGetPiles(
    {
        draw: drawPile,
        hand,
        discard: discardPile,
        removedRoom,
        removedRun,
    }: Piles,
    handSize: number
): Piles {
    let newDrawPile = drawPile
    let newHand = {}
    let newDiscardPile = { ...discardPile, ...hand }
    ;({ newDrawPile, newHand } = drawUpToNCards({
        drawPile,
        hand: newHand,
        n: handSize,
    }))

    if (keys(newHand).length < handSize) {
        if (keys(newDrawPile).length !== 0)
            throw new Error(
                "the draw pile isn't empty but hand size wasn't achieved"
            )
        ;({ newDrawPile, newHand } = drawUpToNCards({
            drawPile: shufflePile(newDiscardPile),
            hand: newHand,
            n: handSize,
        }))

        newDiscardPile = {}
    }

    return {
        draw: newDrawPile,
        hand: newHand,
        discard: newDiscardPile,
        removedRoom,
        removedRun,
    }
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
    if (numToDraw <= 0) return { newDrawPile: drawPile, newHand: hand }

    keys(drawPile)
        .slice(0, numToDraw)
        .forEach(drawKey => {
            newHand = { ...newHand, [drawKey]: drawPile[drawKey] }
            newDrawPile = omit(newDrawPile, drawKey)
        })

    return { newDrawPile, newHand }
}
