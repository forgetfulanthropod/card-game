import { pick, uniq } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import type { Card, CardUid, CharacterUid, Pile } from 'shared'
import { assertFinite, keys, sleep, vals } from 'shared/code'
import type { Datum } from 'datums'
import { CardEl } from './Card'
import { hoveredCharacterUid } from '@/util'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    glowFilter,
    onDestroyed,
} from '@/elementsUtil'
import {
    PixiContainer,
    PixiContainerWithTweenableChildren,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { toDiscardUids } from '@/scenes/run/BattleScene'

// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
const CARD_WIDTH = 260
const CARD_WIDTH_FULL = 400
const CARD_H_TO_W_RATIO = 630 / 450
const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO
const INITIAL_CARDS_X = -800
const INITIAL_CARDS_Y = -50
const INITIAL_CARDS_SCALE = 0.15

export function Hand(
    pile: Pile,
    hoveredCardUid: Datum<CharacterUid | null>,
    toDiscardUids: Datum<CharacterUid[]>
): PixiContainer {
    const characters = getBattleScene().get('allCharacters')
    const sortedCards = vals(pile).sort(
        (cardA, cardB) =>
            characters[cardA.characterUid].y - characters[cardB.characterUid].y
    )

    const CardsInHand = sortedCards.map((card, index) => {
        const Card = CardEl({
            width: CARD_WIDTH,
            card,
            hoveredCardUid,
            omitPointerAreaExtender: true,
        })

        return Adjust(Card, {
            x: INITIAL_CARDS_X,
            y: INITIAL_CARDS_Y,
            scale: INITIAL_CARDS_SCALE,
            alpha: 0.4,
        })
    })

    const animateCardsIntoHand = (
        cards: Card[],
        cardsInHand: TweenablePixiContainer[]
    ) => {
        const scene = getBattleScene()
        const animations = cards.map((card, index) => {
            const { x, y } = getFinalXYRotationForCard(card, pile, index + 1)

            const Card = cardsInHand[index]

            // const charCardOwner = scene.get('allCharacters')[card.characterUid]
            // const [charX, charY] = [
            //     charCardOwner.screenX,
            //     charCardOwner.screenY,
            // ]

            const animation: Promise<void> = new Promise(resolve => {
                setTimeout(async () => {
                    // console.log(`START animation for cardIdx: ${index}`)

                    // await Tweener.add(
                    //     {
                    //         target: Card,
                    //         duration: 0.4,
                    //         ease: Easing.easeFromTo,
                    //     },
                    //     {
                    //         x: -charX,
                    //         y: -charY,
                    //         tweenableScale: 0.4,
                    //         alpha: 0.8,
                    //     }
                    // )

                    Tweener.add(
                        {
                            target: Card,
                            duration: 0.6,
                            ease: Easing.bouncePast,
                        },
                        { tweenableScale: 1 }
                    )

                    await Tweener.add(
                        {
                            target: Card,
                            duration: 0.4,
                            ease: Easing.easeTo,
                        },
                        { x, y, alpha: 1 }
                    )


                    // console.log(`END animation for cardIdx: ${index}`)

                    resolve(void 0)
                }, index * 200)
            })

            return animation
        })

        return Promise.all([...animations])
    }

    lastCardOwnerUidDealt = null
    accumulatedGap = 0

    const root = Container(
        {
            name: 'Player Hand Container',
            x: BASE_WIDTH * 0.5,
            y: BASE_HEIGHT * 1,
        },
        ...CardsInHand
    ) as PixiContainerWithTweenableChildren

    animateCardsIntoHand(sortedCards, CardsInHand).then(() => {
        bindHandAnimations(root, hoveredCardUid, toDiscardUids, pile)
    })

    return root
}

function bindHandAnimations(
    rootEl: PixiContainerWithTweenableChildren,
    hoveredCardUid: Datum<CardUid | null>,
    toDiscardUids: Datum<CardUid[]>,
    pile: Pile
) {
    const initialDisplayVals = getInitialDisplayVals(rootEl, pile)

    const unfocus = getUnfocus(rootEl, initialDisplayVals)
    const focus = getFocus(rootEl, initialDisplayVals, unfocus)
    const select = getSelect(rootEl, initialDisplayVals, unfocus)

    const unsubs: (() => void)[] = []
    unsubs.push(
        hoveredCharacterUid.onChange(_ => {
            updateGlowFilters(rootEl, hoveredCardUid)
        })
    )

    unsubs.push(
        hoveredCardUid.onChange(uid => {
            updateGlowFilters(rootEl, hoveredCardUid)

            if (uid == null) {
                setTimeout(() => {
                    if (hoveredCardUid.val == null) unfocus(toDiscardUids.val)
                }, 100)
                return
            }

            if (!toDiscardUids.val.includes(uid)) focus(uid)
        }),
        toDiscardUids.onChange(uids => {
            select(uids)
        })
    )

    onDestroyed(rootEl, ...unsubs)
}

interface InitialDisplayVal {
    x: number
    y: number
    rotation: number
    scale: number
    zIndex: number
}

type InitialDisplayVals = Record<CardUid, InitialDisplayVal>

function getInitialDisplayVals(
    rootEl: PixiContainerWithTweenableChildren,
    pile: Pile
): InitialDisplayVals {
    const initialDisplayVals: InitialDisplayVals = {}

    vals(pile).forEach((card: Card, zIndex: number) => {
        const c = rootEl.getChildByName(card.uid) as PixiContainer

        initialDisplayVals[card.uid] = {
            x: c.x,
            y: c.y,
            rotation: c.children[0].rotation,
            scale: c.children[0].scale.x,
            zIndex,
        }
    })

    return initialDisplayVals
}

function getUnfocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVals
) {
    return (selectedCardUids: CardUid[]) => {
        rootEl.children.forEach((cardEl: TweenablePixiContainer, i) => {
            if (selectedCardUids.includes(cardEl.name)) return

            const initialDisplayVal = initialDisplayVals[cardEl.name]

            cardEl.zIndex = initialDisplayVal.zIndex
            cardEl.parent.sortChildren()
            animateTo(cardEl, initialDisplayVal)
        })
    }
}

function getFocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVals,
    unfocus: (selectedCardUids: CardUid[]) => void
) {
    return (uid: CardUid) => {
        const cardEl = rootEl.getChildByName(uid) as TweenablePixiContainer

        unfocus([...toDiscardUids.val, uid])
        // spreadOthers(rootEl, cardEl, initialDisplayVals)

        const initialDisplayVal = initialDisplayVals[uid]

        cardEl.zIndex = 99
        cardEl.parent.sortChildren()

        animateTo(cardEl, {
            rotation: 0,
            x: initialDisplayVal.x + ADJUST_HOVERED_CARD_DISTANCE,
            y: initialDisplayVal.y - CARD_HEIGHT_FULL * 0.45,
            scale: (CARD_WIDTH_FULL / CARD_WIDTH) * initialDisplayVal.scale,
        })
    }
}

function getSelect(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVals,
    unfocus: (selectedCardUids: CardUid[]) => void
) {
    return (uids: CardUid[]) => {
        unfocus(uids)

        uids.forEach((uid, index) => {
            const cardEl = rootEl.getChildByName(uid) as TweenablePixiContainer

            const initialDisplayVal = initialDisplayVals[uid]

            const xOffset = CARD_WIDTH_FULL * (-(uids.length - 1) / 2 + index)

            cardEl.zIndex = -1
            cardEl.parent.sortChildren()

            animateTo(cardEl, {
                rotation: 0,
                x: xOffset,
                y: -BASE_HEIGHT * 0.75,
                scale: (CARD_WIDTH_FULL / CARD_WIDTH) * initialDisplayVal.scale,
            })
        })
    }
}

const HAND_SPREAD_DISTANCE = 60
const ADJUST_HOVERED_CARD_DISTANCE = 20

// function spreadOthers(
//     rootEl: PixiContainerWithTweenableChildren,
//     cardEl: TweenablePixiContainer,
//     initialDisplayVals: InitialDisplayVals
// ) {
//     const selectedCardIndex = rootEl.getChildIndex(cardEl)

//     rootEl.children.forEach((cardEl: TweenablePixiContainer, i) => {
//         if (i === selectedCardIndex) return
//         if (toDiscardUids.val.includes(cardEl.name)) return

//         cardEl.zIndex = initialDisplayVals[cardEl.name].zIndex

//         const leftOrRight = i > selectedCardIndex ? 'left' : 'right' //cards laid right to left for energy corner

//         animateTo(cardEl, {
//             x:
//                 initialDisplayVals[cardEl.name].x +
//                 (leftOrRight === 'left'
//                     ? -HAND_SPREAD_DISTANCE
//                     : HAND_SPREAD_DISTANCE),
//             y: initialDisplayVals[cardEl.name].y,
//             rotation: initialDisplayVals[cardEl.name].rotation,
//             scale: initialDisplayVals[cardEl.name].scale,
//         })
//     })

//     rootEl.sortChildren()
// }

// const glowFilter = new GlowFilter({
//     innerStrength: 0,
//     outerStrength: 3,
//     distance: 40,
//     color: 0xffffff,
//     knockout: false,
// })

function updateGlowFilters(
    handEl: PixiContainerWithTweenableChildren,
    hoveredCardUid: Datum<CardUid | null>
) {
    handEl.children.forEach(el => {
        const filteredEl = (el as PixiContainer).children[0]
        if (hoveredCardUid.val != null) {
            if (hoveredCardUid.val === el.name) {
                filteredEl.filters = [glowFilter]
            } else {
                filteredEl.filters = null
            }
        } else if (hoveredCharacterUid.val != null) {
            const card = getBattleScene()
                .select('cards', 'hand')
                .select(el.name as CardUid)
                .get()
            if (hoveredCharacterUid.val === card.characterUid) {
                filteredEl.filters = [glowFilter]
            } else {
                filteredEl.filters = null
            }
        } else {
            filteredEl.filters = null
        }
    })
}

export function animateTo(
    cardEl: TweenablePixiContainer,
    displayVal: Omit<InitialDisplayVal, 'zIndex'>
) {
    if (cardEl == null) return

    Tweener.killTweensOf(cardEl)
    Tweener.killTweensOf(cardEl.children[0])
    onDestroyed(cardEl, () => {
        Tweener.killTweensOf(cardEl)
        Tweener.killTweensOf(cardEl.children[0])
    })
    void Tweener.add(
        {
            target: cardEl,
            duration: 0.2,
            ease: Easing.easeFromTo,
        },
        {
            ...pick(displayVal, 'x', 'y'),
        }
    )
    void Tweener.add(
        {
            target: cardEl.children[0] as TweenablePixiContainer,
            duration: 0.1,
        },
        {
            ...pick(displayVal, 'rotation'),
            tweenableScale: displayVal.scale,
        }
    )
}
type XYRotation = { x: number; y: number; rotation: number }

let lastCardOwnerUidDealt: CharacterUid | null
let accumulatedGap: number = 0

function getFinalXYRotationForCard(
    card: Card,
    pile: Pile,
    cardIdx: number
): XYRotation {
    const RIGHT_TO_LEFT = 1
    const MAX_HAND_WIDTH = BASE_WIDTH * 0.5
    const Y_OFFSET = BASE_HEIGHT * 0.21

    // const MAX_CARD_ROTATION = Math.PI * 0.1
    // const Y_MAX_OFFSET = BASE_HEIGHT * 0.22
    // const Y_MIN_OFFSET = BASE_HEIGHT * 0.2

    const numCardsInHand = keys(pile).length

    if (cardIdx < 1 || cardIdx > numCardsInHand)
        throw new Error(
            `cardIdx must be between 1 and numCardsInHand, value: ${cardIdx}`
        )

    const handWidth = Math.min(
        (numCardsInHand - 1) * CARD_WIDTH * 0.77,
        MAX_HAND_WIDTH
    )

    let xGapPortion = 2 / Math.max(numCardsInHand - 1, 1)
    let xGap = xGapPortion * handWidth * 0.5
    const numCharacterGaps =
        uniq(keys(pile).map(pileKey => pile[pileKey].characterUid)).length - 1
    xGapPortion =
        handWidth > 0
            ? (xGapPortion *
                  (handWidth - numCharacterGaps * (CARD_WIDTH - xGap))) /
              handWidth
            : 0
    xGap = xGapPortion * handWidth * 0.5

    let xPlacementPortion =
        RIGHT_TO_LEFT - RIGHT_TO_LEFT * (cardIdx - 1) * xGapPortion // -1 -> 1

    const owningCharacterSwitchGap =
        lastCardOwnerUidDealt != null &&
        lastCardOwnerUidDealt != card.characterUid
            ? (accumulatedGap += CARD_WIDTH - xGap)
            : accumulatedGap

    lastCardOwnerUidDealt = card.characterUid

    return assertFinite({
        x:
            handWidth * 0.5 * xPlacementPortion -
            RIGHT_TO_LEFT * owningCharacterSwitchGap +
            CARD_WIDTH * 0.1,
        y: -Y_OFFSET,
        // y:
        //     -Y_MIN_OFFSET -
        //     (Y_MAX_OFFSET - Y_MIN_OFFSET) * (1 - Math.abs(xPlacementPortion)),
        // rotation: xPlacementPortion * endCardRotation,
        rotation: 0,
    })

    // function getCumulativeGaps(): number {
    //     return 0

    //     return (numUniqueCharactersInDeck - 1) * (CARD_WIDTH - xGap)
    // }
}
