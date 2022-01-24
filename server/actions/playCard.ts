import type { PlayCard } from '@serverActions'
import type { Card, CardUid, CharacterUid, Pile } from '@shared'
import { omit, shuffle } from 'lodash'

import { getCharIds } from '@/gameState/battle'
import type { BattleCursor } from '@/util'
import { getBattleScene, keys, vals } from '@/util'

export const playCard: PlayCard = args => {
    const scene = getBattleScene(args.username)
    const card = findCard({ cardUid: args.cardUid, scene })

    if (isPlayable({ card, scene })) {
        play({ card, scene })
        discard({ cardUid: args.cardUid, card, scene })
    }
}

function findCard({
    cardUid,
    scene,
}: {
    cardUid: CardUid
    scene: BattleCursor
}): Card {
    const cards = scene.get('cards')

    const cardIndex = keys(cards.hand).findIndex(uid => cardUid === uid)
    const card = vals(cards.hand)[cardIndex]

    if (card == null) throw new Error('card Uid not found, something is wrong')

    return card
}

function isPlayable({
    card,
    scene,
}: {
    card: Card
    scene: BattleCursor
}): boolean {
    const hasEnoughEnergy = getEnergy(card) < scene.select('energy').get()

    return hasEnoughEnergy
}

function getEnergy(card: Card): number {
    return card.energy
}

function play({ card, scene }: { card: Card; scene: BattleCursor }): void {
    scene.set('energy', scene.get('energy') - card.energy)

    // applyDamageToEnemy(getDamage({ card, scene }), getLivingNpcUid(scene))
    applyDamageToEnemy({ damage: 1, enemyUid: getLivingNpcUid(scene), scene })
}

function applyDamageToEnemy({
    damage,
    enemyUid,
    scene,
}: {
    damage: number
    enemyUid: CharacterUid
    scene: BattleCursor
}): void {
    scene.select('allCharacters', enemyUid).apply('health', h => h - damage)
}

function getLivingNpcUid(scene: BattleCursor): CharacterUid {
    return getCharIds(vals(scene.get('allCharacters')), { isPc: false })[0]
}

function discard(args: {
    cardUid: CardUid
    card: Card
    scene: BattleCursor
}): void {
    args.scene.apply('cards', cards => {
        let draw = cards.draw
        let hand = omit(cards.hand, args.cardUid)
        let discard = { ...cards.discard, ...{ [args.cardUid]: args.card } }

        if (keys(hand).length === 0)
            ({ draw, hand, discard } = drawNewHand({
                drawPile: draw,
                hand,
                discardPile: discard,
            }))

        return { ...cards, draw, hand, discard }
    })
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
