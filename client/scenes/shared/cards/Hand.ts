import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    glowFilter,
    onDestroyed,
    PixiContainer,
    PixiContainerWithTweenableChildren,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { toDiscardUids } from '@/scenes/run/BattleScene'
import { hoveredCharacterUid, hoveredSelectedCardUid, toDatum } from '@/util'
import type { Datum } from 'datums'
import { isEmpty, pick, uniq } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import type { Card, CardUid, CharacterUid, Pile } from 'shared'
import { assertFinite, keys, vals } from 'shared/code'
import { runKeyframeAnimations } from '../tweenerAnimations'
import { CardEl } from './Card'

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
const CARD_FOCUS_Y_OFFSET = CARD_HEIGHT_FULL * 0.38

export function Hand(
    hoveredCardUid: Datum<CharacterUid | null>,
    toDiscardUids: Datum<CharacterUid[]>
) {
    const unsubs: Callback[] = []
    let initialDisplayVals: InitialDisplayVals

    const handDatum = toDatum(
        getBattleScene().select('cards').select('hand'),
        hand => hand
    )

    // this will only ever have 1 child
    const staticRoot = Container(
        {
            name: 'PlayerHandContainer',
        },
        createDestructibleContainer()
    )

    function getDestructibleRoot() {
        if (staticRoot.children.length > 0) {
            return staticRoot.getChildAt(
                0
            ) as PixiContainerWithTweenableChildren
        } else {
            return staticRoot.addChild(createDestructibleContainer())
        }
    }

    function handleTargetingCardChange(
        cardUid: CardUid | null,
        prevCardUid: CardUid | null
    ) {
        const destructibleRoot = getDestructibleRoot()
        if (cardUid)
            centerCardEl(destructibleRoot, cardUid, initialDisplayVals)
        if (prevCardUid)
            uncenterCardEl(destructibleRoot, prevCardUid, initialDisplayVals)
    }

    async function handleHandChange(newHand: Pile, prevHand: Pile) {
        lastCardOwnerUidDealt = null
        accumulatedGap = 0

        const currHandEmpty = isEmpty(newHand)
        const prevHandEmpty = isEmpty(prevHand)

        if (!currHandEmpty && prevHandEmpty)
            return await animateAllCardsIntoHand(newHand) // start turn
        else if (currHandEmpty && !prevHandEmpty)
            return await animateDiscardAllCardsOut() // end turn
        else if (keys(newHand).length !== keys(prevHand).length)
            return await animateCardOutAndRefresh(prevHand, newHand) // play a card
        else if (newHand)
            return await refreshCardsInHand(newHand, 'final') // refresh page
        else
            return console.warn({
                error: 'newHand was empty in Hand.ts',
                newHand,
                prevHand,
            })
    }

    async function animateAllCardsIntoHand(newHand: Pile) {
        await refreshCardsInHand(newHand, 'initial')
    }

    async function animateDiscardAllCardsOut() {
        const destructibleRoot = getDestructibleRoot()
        const discardAnimations = await animateAllCardsToDiscardPile(
            destructibleRoot.children
        )
        await Promise.all(discardAnimations)
        destructibleRoot.removeChildren()
        destructibleRoot.destroy()
        hoveredCharacterUid.set(null) // tmp fix for character hover persisting
    }

    async function animateCardOutAndRefresh(prevHand: Pile, newHand: Pile) {
        const destructibleRoot = getDestructibleRoot()
        const cardsRemoved = keys(prevHand).filter(
            card => !keys(newHand).includes(card)
        )
        if (cardsRemoved && cardsRemoved.length === 1) {
            const CardToAnimateOut = destructibleRoot.getChildByName(
                cardsRemoved[0]
            ) as TweenablePixiContainer
            await animatePlayCard(CardToAnimateOut)
        }
        refreshCardsInHand(newHand, 'final')
        hoveredCharacterUid.set(null)
        return
    }

    async function refreshCardsInHand(
        newHand: Pile,
        position: 'final' | 'initial'
    ) {
        let destructibleRoot = getDestructibleRoot()
        destructibleRoot.removeChildren()
        destructibleRoot.destroy()

        destructibleRoot = getDestructibleRoot()
        const NewCardsInHand = renderCardsInHand(
            newHand,
            hoveredCardUid,
            position
        )
        destructibleRoot.addChild(...NewCardsInHand)
        if (position === 'initial')
            await animateCardsIntoHand(NewCardsInHand, newHand)

        bindHandAnimations(
            destructibleRoot,
            hoveredCardUid,
            toDiscardUids,
            newHand
        )
        initialDisplayVals = getInitialDisplayVals(destructibleRoot, newHand)
        if (hoveredSelectedCardUid.val) {
            centerCardEl(
                getDestructibleRoot(),
                hoveredSelectedCardUid.val,
                initialDisplayVals,
                0
            )
        }
        return NewCardsInHand
    }

    unsubs.push(
        hoveredSelectedCardUid.onChange(handleTargetingCardChange),
        handDatum.onChange(handleHandChange, true)
    )

    return onDestroyed(staticRoot, ...unsubs)
}

// this container exists to clean up subscriptions, it is destroyed and rerendered imperatively
function createDestructibleContainer() {
    return Container({
        name: 'DestructiblePlayerHandContainer',
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
    }) as PixiContainerWithTweenableChildren
}

async function centerCardEl(
    destructibleRoot: PixiContainerWithTweenableChildren,
    cardUid: CardUid,
    initialDisplayVals: InitialDisplayVals,
    duration = 0.25
) {
    const CardEl = destructibleRoot.getChildByName(
        cardUid
    ) as TweenablePixiContainer
    if (!CardEl) return new Error(`no pixi element for ${cardUid}`)

    destructibleRoot.setChildIndex(CardEl, destructibleRoot.children.length - 1)
    Tweener.killTweensOf(CardEl)

    if (!initialDisplayVals[cardUid]) {
        console.log({ initialDisplayVals })
        throw new Error(`initial display val for ${cardUid} not set`)
    }

    getFocus(destructibleRoot, initialDisplayVals, _ => {})(cardUid)

    await Tweener.add(
        { target: CardEl, duration, ease: Easing.easeFromTo },
        { x: 0 }
    )
}

async function uncenterCardEl(
    destructibleRoot: PixiContainerWithTweenableChildren,
    cardUid: CardUid,
    initialDisplayVals: InitialDisplayVals
) {
    const CardEl = destructibleRoot.getChildByName(
        cardUid ?? ''
    ) as TweenablePixiContainer
    if (!CardEl) return new Error(`no pixi element for ${cardUid}`)

    const targetDisplayVals = initialDisplayVals[cardUid]
    if (!targetDisplayVals) return new Error('dafuk no display vals')

    animateTo(CardEl, targetDisplayVals)
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
            dynamicHitbox: true,
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
            if (
                hoveredSelectedCardUid.val === cardEl.name ||
                selectedCardUids.includes(cardEl.name)
            )
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
        spreadOthers(rootEl, cardEl, initialDisplayVals)

        const initialDisplayVal = initialDisplayVals[uid]

        cardEl.zIndex = 99
        cardEl.parent.sortChildren()

        animateTo(
            cardEl,
            {
                rotation: 0,
                x: initialDisplayVal.x + ADJUST_HOVERED_CARD_DISTANCE,
                y: initialDisplayVal.y - CARD_FOCUS_Y_OFFSET,
                scale: 0.9,
            },
            0.001
        )
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

function spreadOthers(
    rootEl: PixiContainerWithTweenableChildren,
    cardEl: TweenablePixiContainer,
    initialDisplayVals: InitialDisplayVals
) {
    const selectedCardIndex = rootEl.getChildIndex(cardEl)

    rootEl.children.forEach((cardEl: TweenablePixiContainer, i) => {
        if (i === selectedCardIndex) return
        if (toDiscardUids.val.includes(cardEl.name)) return

        cardEl.zIndex = initialDisplayVals[cardEl.name].zIndex

        const leftOrRight = i > selectedCardIndex ? 'left' : 'right' //cards laid right to left for energy corner

        animateTo(cardEl, {
            x:
                initialDisplayVals[cardEl.name].x +
                (leftOrRight === 'left'
                    ? -HAND_SPREAD_DISTANCE
                    : HAND_SPREAD_DISTANCE),
            y: initialDisplayVals[cardEl.name].y,
            rotation: initialDisplayVals[cardEl.name].rotation,
            scale: initialDisplayVals[cardEl.name].scale,
        })
    })

    rootEl.sortChildren()
}

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
    displayVal: Omit<InitialDisplayVal, 'zIndex'>,
    duration?: number
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
            duration: duration ?? 0.2,
            ease: Easing.easeTo,
        },
        {
            ...pick(displayVal, 'x', 'y'),
        }
    )
    void Tweener.add(
        {
            target: cardEl.children[0] as TweenablePixiContainer,
            duration: duration ? duration / 2 : 0.1,
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
