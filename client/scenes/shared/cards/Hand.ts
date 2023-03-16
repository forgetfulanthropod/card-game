import { isEmpty, pick, uniq } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import type { Card, CardUid, CharacterUid, Pile } from 'shared'
import { assertFinite, keys, sleep, vals } from 'shared/code'
import type { Datum } from 'datums'
import { CardEl } from './Card'
import { hoveredCharacterUid, hoveredSelectedCardUid, toDatum } from '@/util'
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
import { runKeyframeAnimations } from '../tweenerAnimations'

// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
const CARD_WIDTH = 260
const CARD_WIDTH_FULL = 400
const CARD_H_TO_W_RATIO = 630 / 450
const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO
const INITIAL_CARDS_X = -900
const INITIAL_CARDS_Y = -80
const INITIAL_CARDS_SCALE = 0.1
const INITIAL_CARDS_ALPHA = 1
const INITIAL_CARDS_ROTATION = -1.55
const CARD_ANIMATION_INTERVAL = 250 // ms

export function Hand(
    hoveredCardUid: Datum<CharacterUid | null>,
    toDiscardUids: Datum<CharacterUid[]>
) {
    const handDatum = toDatum(
        getBattleScene().select('cards').select('hand'),
        hand => hand
    )

    let initialDisplayVals: InitialDisplayVals

    hoveredSelectedCardUid.onChange((cardUid, prevCardUid) => {
        const destroyableRoot = staticRoot.getChildAt(
            0
        ) as PixiContainerWithTweenableChildren
        if (!destroyableRoot) return

        if (cardUid) centerTargetingCardEl(destroyableRoot, cardUid)
        if (prevCardUid) uncenterCardEl(destroyableRoot, prevCardUid)
    })

    const centerTargetingCardEl = async (
        destroyableRoot: PixiContainerWithTweenableChildren,
        cardUid: CardUid
    ) => {
        const CardEl = destroyableRoot.getChildByName(
            cardUid ?? ''
        ) as TweenablePixiContainer
        if (!CardEl) return new Error(`no pixi element for ${cardUid}`)
        destroyableRoot.setChildIndex(
            CardEl,
            destroyableRoot.children.length - 1
        )
        await Tweener.add(
            { target: CardEl, duration: 0.25, ease: Easing.easeFromTo },
            { x: 0 }
        )
    }

    const uncenterCardEl = async (
        destroyableRoot: PixiContainerWithTweenableChildren,
        cardUid: CardUid
    ) => {
        const CardEl = destroyableRoot.getChildByName(
            cardUid ?? ''
        ) as TweenablePixiContainer
        if (!CardEl) return new Error(`no pixi element for ${cardUid}`)

        const targetDisplayVals = initialDisplayVals[cardUid]
        if (!targetDisplayVals) return new Error('dafuk no display vals')

        animateTo(CardEl, targetDisplayVals)
    }

    // this container exists to clean up subscriptions, it is destroyed and rerendered imperatively
    const createDestroyableContainer = () =>
        Container({
            name: 'DestroyablePlayerHandContainer',
            x: BASE_WIDTH * 0.5,
            y: BASE_HEIGHT * 1,
        }) as PixiContainerWithTweenableChildren

    // this will only ever have 1 child
    const staticRoot = Container(
        {
            name: 'PlayerHandContainer',
        },
        createDestroyableContainer()
    )

    const unsub = handDatum.onChange(async (newHand, prevHand) => {
        let root: PixiContainerWithTweenableChildren // DestroyablePlayerHandContainer
        if (staticRoot.children.length > 0) {
            root = staticRoot.getChildAt(
                0
            ) as PixiContainerWithTweenableChildren
        } else {
            root = staticRoot.addChild(createDestroyableContainer())
        }

        lastCardOwnerUidDealt = null
        accumulatedGap = 0

        const currHandEmpty = isEmpty(newHand)
        const prevHandEmpty = isEmpty(prevHand)

        if (!currHandEmpty && prevHandEmpty) {
            // Animate all cards into hand
            root.removeChildren()
            const NewCardsInHand = renderCardsInHand(newHand, hoveredCardUid)
            root.addChild(...NewCardsInHand)
            await animateCardsIntoHand(NewCardsInHand, newHand)
            bindHandAnimations(root, hoveredCardUid, toDiscardUids, newHand)
            return
        } else if (currHandEmpty && !prevHandEmpty) {
            // console.log('animate discarding all cards!')
            const discardAnimations = await animateAllCardsToDiscardPile(
                root.children
            )
            await Promise.all(discardAnimations)
            root.removeChildren()
            root.destroy()
            hoveredCharacterUid.set(null) // tmp fix for character hover persisting
            return
        } else if (keys(newHand).length !== keys(prevHand).length) {
            // One card was played - animate out
            const cardsRemoved = keys(prevHand).filter(
                card => !keys(newHand).includes(card)
            )
            if (cardsRemoved && cardsRemoved.length === 1) {
                const CardToAnimateOut = root.getChildByName(
                    cardsRemoved[0]
                ) as TweenablePixiContainer
                await animatePlayCard(CardToAnimateOut)
            }
            root.removeChildren()
            root.destroy()
            root = staticRoot.addChild(createDestroyableContainer())
            const NewCardsInHand = renderCardsInHand(
                newHand,
                hoveredCardUid,
                'final'
            )
            root.addChild(...NewCardsInHand)
            bindHandAnimations(root, hoveredCardUid, toDiscardUids, newHand)
            hoveredCharacterUid.set(null)
            return
        } else if (newHand) {
            // Datum changed - render cards in final position
            root.removeChildren()
            root.destroy()
            root = staticRoot.addChild(createDestroyableContainer())
            const CardsInHand = renderCardsInHand(
                newHand,
                hoveredCardUid,
                'final'
            )
            root.addChild(...CardsInHand)
            bindHandAnimations(root, hoveredCardUid, toDiscardUids, newHand)
        }

        initialDisplayVals = getInitialDisplayVals(root, newHand)
    }, true)

    onDestroyed(staticRoot, unsub)

    return staticRoot
}

function renderCardsInHand(
    handPile: Pile,
    hoveredCardUid: Datum<CharacterUid | null>,
    position: 'initial' | 'final' = 'initial'
): TweenablePixiContainer[] {
    const sortedCards = getSortedCards(handPile)

    return sortedCards.map((card, index) => {
        const { x, y, scale, alpha, rotation } =
            position === 'final'
                ? {
                      ...getFinalXYRotationForCard(card, handPile, index + 1),
                      scale: 1,
                      alpha: 1,
                      rotation: 0,
                  }
                : {
                      x: INITIAL_CARDS_X,
                      y: INITIAL_CARDS_Y,
                      scale: INITIAL_CARDS_SCALE,
                      alpha: INITIAL_CARDS_ALPHA,
                      rotation: INITIAL_CARDS_ROTATION,
                  }

        const Card = CardEl({
            width: CARD_WIDTH,
            card,
            hoveredCardUid,
            omitPointerAreaExtender: true,
        })

        return Adjust(Card, {
            x,
            y,
            scale,
            alpha,
            rotation,
        })
    })
}

function getSortedCards(pile: Pile): Card[] {
    const characters = getBattleScene().get('allCharacters')

    return vals(pile).sort(
        (cardA, cardB) =>
            characters[cardA.characterUid].y - characters[cardB.characterUid].y
    )
}

const animateCardsIntoHand = (
    CardsInHand: TweenablePixiContainer[],
    pile: Pile
): Promise<void[]> => {
    const sortedCards = getSortedCards(pile)
    const animations = sortedCards.map((card, index) => {
        const { x, y } = getFinalXYRotationForCard(card, pile, index + 1)
        const Card = CardsInHand[index]
        const animationDuration = 0.25
        return new Promise(resolve => {
            setTimeout(async () => {
                await runKeyframeAnimations(Card, animationDuration, [
                    {
                        keyframes: Math.max(
                            (keys(pile).length - index) * 5,
                            10
                        ),
                        tweenableScale: 1,
                    },
                    {
                        keyframes: 25,
                        x,
                        // ease: Easing.easeFromTo
                    },
                    {
                        keyframes: 25,
                        y,
                        ease: Easing.easeTo,
                    },
                    {
                        keyframes: 20,
                        rotation: 0,
                        // ease: Easing.easeFromTo,
                    },
                ])
                resolve(void 0)
            }, (index * CARD_ANIMATION_INTERVAL) / 2)
        }) as Promise<void>
    })
    return Promise.all([...animations])
}

const animatePlayCard = async (CardEl: TweenablePixiContainer) => {
    CardEl.getChildAt(0).removeAllListeners()
    Tweener.add(
        {
            target: CardEl,
            duration: 0.1,
            ease: Easing.easeTo,
        },
        { tweenableScale: 1.05, y: -500 }
    )
    await new Promise(res => setTimeout(() => res(void 0), 90))

    await Tweener.add(
        {
            target: CardEl,
            duration: 0.15,
            ease: Easing.easeOutSine,
        },
        { tweenableScale: 0.4, y: -400, rotation: 2.3 }
    )

    await Tweener.add(
        {
            target: CardEl,
            duration: 0.15,
            ease: Easing.easeFrom,
        },
        { tweenableScale: 0.1, x: 900, y: -70, alpha: 0 }
    )
    CardEl.destroy()
}

const animateAllCardsToDiscardPile = async (
    CardEls: TweenablePixiContainer[]
) => {
    return CardEls.map(async (CardEl, idx) => {
        CardEl.removeAllListeners()
        return new Promise(res => {
            setTimeout(async () => {
                await runKeyframeAnimations(
                    CardEl,
                    0.25,
                    {
                        keyframes: 20,
                        tweenableScale: 0.95,
                        y: -300,
                    },
                    {
                        keyframes: 10,
                        tweenableScale: 1.05,
                    },
                    [
                        {
                            keyframes: 10,
                            rotation: -INITIAL_CARDS_ROTATION,
                            y: INITIAL_CARDS_Y,
                        },
                        {
                            keyframes: 20,
                            x: 900,
                            tweenableScale: INITIAL_CARDS_SCALE,
                            // ease: Easing
                        },
                    ]
                )
                res(void 0)
            }, (idx * CARD_ANIMATION_INTERVAL) / 2)
        })
    })
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
        const c = rootEl.getChildByName(card.uid) as unknown as PixiContainer

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
            if (hoveredSelectedCardUid.val === cardEl.name)
                return

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
            if (!card || hoveredCharacterUid.val !== card.characterUid) {
                filteredEl.filters = null
            } else {
                filteredEl.filters = [glowFilter]
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
            ease: Easing.easeTo,
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
