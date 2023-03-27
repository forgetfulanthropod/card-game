import { getBattleScene, getScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    flashGlowAndBrightnessTo,
    getRenderer,
    getStage,
    glowFilter,
    onDestroyed,
    PixiContainer,
    PixiContainerWithTweenableChildren,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { toDiscardUids } from '@/scenes/run/BattleScene'
import {
    currAnimatingCardUid,
    hoveredCharacterUid,
    nextFrame,
    isTargeting,
    selectedForTargetingCardUid,
    toDatum,
} from '@/util'
import { Datum } from 'datums'
import { isEmpty, pick, uniq } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import { FederatedPointerEvent } from 'pixi.js'
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
const TARGETABLE_AREA_Y_OFFSET = 880
const RIGHT_TO_LEFT = 1
const MAX_HAND_WIDTH = BASE_WIDTH * 0.5
const CARD_INITIAL_Y_OFFSET = BASE_HEIGHT * 0.21

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
        targetingCardUid: CardUid | null,
        prevTargetingCardUid: CardUid | null
    ) {
        const destructibleRoot = getDestructibleRoot()

        if (targetingCardUid) {
            const { x, y } =
                getRenderer().plugins.interaction.rootPointerEvent.screen

            // TODO: fix below scenario (maybe not needed when we make hovered cards smaller)
            // if (y < TARGETABLE_AREA_Y_OFFSET)
            //     return handleCursorInsideTargetableArea(cardUid)

            const CardEl = getCardElFromUid(targetingCardUid)

            // animates card to base position of draggable state
            runKeyframeAnimations(CardEl, 0.25, {
                keyframes: 10,
                x: x - BASE_WIDTH / 2,
                y: y - BASE_HEIGHT - 275,
                ease: Easing.easeFromTo,
            })
            getStage().interactive = true
            getStage().on('pointermove', dragCardUntilTargeting)
        }

        if (!targetingCardUid) {
            getStage().interactive = false
            getStage().off('pointermove', dragCardUntilTargeting)
        }

        if (
            prevTargetingCardUid &&
            prevTargetingCardUid !== currAnimatingCardUid.val
        ) {
            uncenterCardEl(
                destructibleRoot,
                prevTargetingCardUid,
                initialDisplayVals
            )
        }
    }

    let DraggableCardEl: TweenablePixiContainer | null
    function dragCardUntilTargeting(e: FederatedPointerEvent): void {
        const selectedCardUid = selectedForTargetingCardUid.val
        if (!selectedCardUid) {
            getStage().off('pointermove', dragCardUntilTargeting)
            return
        }
        if (!DraggableCardEl)
            DraggableCardEl = getCardElFromUid(selectedCardUid)

        if (cursorInsideTargetableArea(e)) {
            handleCursorInsideTargetableArea(selectedCardUid)
            DraggableCardEl = null
            return
        } else {
            const { x, y } = e.screen
            const [targetX, targetY] = [
                x - BASE_WIDTH / 2,
                y - BASE_HEIGHT - 275,
            ]
            // used for smooth motion
            runKeyframeAnimations(DraggableCardEl, 0.06, {
                keyframes: 10,
                x: targetX,
                y: targetY,
            })
        }
    }

    function handleCursorInsideTargetableArea(selectedCardUid: CardUid) {
        isTargeting.set(true)
        getStage().off('pointermove', dragCardUntilTargeting)
        const CardEl = getCardElFromUid(selectedCardUid)
        flashGlowAndBrightnessTo(CardEl)
        centerCardEl(getDestructibleRoot(), selectedCardUid, initialDisplayVals)
    }

    function getCardElFromUid(cardUid: CardUid): TweenablePixiContainer {
        const destructibleRoot = getDestructibleRoot()
        return destructibleRoot.getChildByName(cardUid)
    }

    async function handleHandChange(newHand: Pile, prevHand: Pile) {
        lastCardOwnerUidDealt = null
        accumulatedGap = 0

        const currHandEmpty = isEmpty(newHand)
        const prevHandEmpty = isEmpty(prevHand)

        if (!currHandEmpty && prevHandEmpty)
            // start turn
            return await animateAllCardsIntoHand(newHand)
        else if (currHandEmpty && !prevHandEmpty)
            // end turn
            return await animateDiscardAllCardsOut()
        else if (keys(newHand).length !== keys(prevHand).length)
            // play a card
            return await animateCardOutAndRerenderHand(prevHand, newHand)
        else if (newHand)
            // page was refreshed
            return await rerenderCardsInHand(newHand, 'final')
        else
            return console.warn({
                error: 'newHand was empty in Hand.ts',
                newHand,
                prevHand,
            })
    }

    async function animateAllCardsIntoHand(newHand: Pile) {
        await rerenderCardsInHand(newHand, 'initial')
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

    async function animateCardOutAndRerenderHand(
        prevHand: Pile,
        newHand: Pile
    ) {
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
        rerenderCardsInHand(newHand, 'final')
        hoveredCharacterUid.set(null)
        selectedForTargetingCardUid.set(null)
        return
    }

    async function rerenderCardsInHand(
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

        // await nextFrame() // may fix card in corner bug when user navigates away during card draw

        bindHandAnimations(
            destructibleRoot,
            hoveredCardUid,
            toDiscardUids,
            newHand
        )
        initialDisplayVals = getInitialDisplayVals(destructibleRoot, newHand)
        if (selectedForTargetingCardUid.val) {
            centerCardEl(
                getDestructibleRoot(),
                selectedForTargetingCardUid.val,
                initialDisplayVals,
                0
            )
        }

        destructibleRoot.children.forEach(
            CardEl => (CardEl.zIndex = initialDisplayVals[CardEl.name].zIndex)
        )

        return NewCardsInHand
    }

    unsubs.push(
        selectedForTargetingCardUid.onChange(handleTargetingCardChange),
        handDatum.onChange(handleHandChange, true),
        () => getStage().off('pointermove', dragCardUntilTargeting)
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

function cursorInsideTargetableArea(e: FederatedPointerEvent): boolean {
    return e.screen.y < TARGETABLE_AREA_Y_OFFSET
}

async function centerCardEl(
    destructibleRoot: PixiContainerWithTweenableChildren,
    cardUid: CardUid,
    initialDisplayVals: InitialDisplayVals,
    duration = 0.4
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
        { target: CardEl, duration, ease: Easing.easeInOutCubic },
        { x: 0, y: initialDisplayVals[cardUid].y - CARD_FOCUS_Y_OFFSET }
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
    if (!targetDisplayVals) return new Error(`no display vals for ${cardUid}`)

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
    currAnimatingCardUid.set(CardEl.name)
    flashGlowAndBrightnessTo(CardEl, 0.4)
    const originalScale = CardEl.scale.x
    await runKeyframeAnimations(
        CardEl,
        0.35,
        { keyframes: 5, tweenableScale: originalScale * 0.8 },
        { keyframes: 10, tweenableScale: originalScale, ease: Easing.easeTo },
        { keyframes: 15 },
        { keyframes: 15, tweenableScale: 0.4, x: 500, y: -200, rotation: 1.7 },
        {
            keyframes: 15,
            tweenableScale: 0.1,
            x: 900,
            y: -70,
            rotation: 2.3,
        }
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
            // updateGlowFilters(rootEl, hoveredCardUid)

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


    rootEl.children.forEach((Card, idx) => {
        const CardEl = Card as TweenablePixiContainer
        initialDisplayVals[CardEl.name as CardUid] = {
            x: CardEl.x,
            y: CardEl.y,
            rotation: CardEl.children[0].rotation,
            scale: CardEl.children[0].scale.x,
            zIndex: idx,
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
                selectedForTargetingCardUid.val === cardEl.name ||
                selectedCardUids.includes(cardEl.name)
            )
                return

            const initialDisplayVal = initialDisplayVals[cardEl.name]

            cardEl.zIndex = initialDisplayVal.zIndex
            cardEl.parent.sortChildren()
            animateTo(cardEl, initialDisplayVal, 0.35)
        })
    }
}

function getFocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVals,
    unfocus: (selectedCardUids: CardUid[]) => void
) {
    return (uid: CardUid) => {
        if (
            selectedForTargetingCardUid.val &&
            selectedForTargetingCardUid.val !== uid
        )
            return
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
const ADJUST_HOVERED_CARD_DISTANCE = 0

function spreadOthers(
    RootEl: PixiContainerWithTweenableChildren,
    CardEl: TweenablePixiContainer,
    initialDisplayVals: InitialDisplayVals
) {
    RootEl.sortChildren()
    const scene = getBattleScene()
    const hand = scene.get('cards').hand
    const hoveredCardIdx = initialDisplayVals[CardEl.name]?.zIndex
    const hoveredCardMeta = hand[CardEl.name]
    const [leftEdgeIdx, rightEdgeIdx] = [RootEl.children.length - 1, 0]

    for (let cardIdx = hoveredCardIdx + 1, i = 0; cardIdx <= leftEdgeIdx; cardIdx++, i++) {
        const LeftCardEl = RootEl.getChildAt(
            cardIdx
        ) as TweenablePixiContainer
        const cardMeta = hand[LeftCardEl.name]
        if (hoveredCardMeta.characterUid !== cardMeta.characterUid) break

        const targetX = Math.min(0, -78 + (40 * i))
        runKeyframeAnimations(LeftCardEl, 0.35, {
            keyframes: 1,
            x: initialDisplayVals[LeftCardEl.name].x + targetX,
            ease: Easing.easeTo,
        })

    }

    for (let cardIdx = hoveredCardIdx - 1, i = 0; cardIdx >= 0; cardIdx--, i++) {
        const RightCardEl = RootEl.getChildAt(
            cardIdx
        ) as TweenablePixiContainer
        const cardMeta = hand[RightCardEl.name]
        if (hoveredCardMeta.characterUid !== cardMeta.characterUid) break
        const targetX = Math.max(0, 78 - (40 * i))

        // ideal (but not implmemnnted) gaps below
        // 3 chars, 2 chars = 90px between cards when hovered
        // 1 char = 80px
        runKeyframeAnimations(RightCardEl, 0.35, {
            keyframes: 1,
            x: initialDisplayVals[RightCardEl.name].x + targetX,
            ease: Easing.easeTo,
        })
    }

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
        y: -CARD_INITIAL_Y_OFFSET,
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
