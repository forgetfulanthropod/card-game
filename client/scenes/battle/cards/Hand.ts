import { pick } from 'lodash'
import { Tweener } from 'pixi-tweener'
import type { CardUid, CharacterUid, Pile } from 'shared'
import { keys, vals } from 'shared/code'
import type { Datum } from 'datums'
import { Card } from './Card'
import { assertFinite, hoveredCharacterUid } from '@/util'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    glowFilter,
    onDestroyed,
} from '@/elementsUtil'
import type {
    PixiContainer,
    PixiContainerWithTweenableChildren,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'

const CARD_H_TO_W_RATIO = 630 / 450
const CARD_WIDTH_IN_HAND = 220
// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
const CARD_WIDTH_FULL = 350
const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO
const CARD_WIDTH = 220

export function Hand(
    pile: Pile,
    hoveredCardUid: Datum<CharacterUid | null>
): PixiContainer {
    const total = keys(pile).length

    const children = vals(pile).map((card, index) => {
        const { x, y, rotation } = getXYRotationForNthCard(index + 1, total)
        return Adjust(
            Card({
                rotation,
                width: CARD_WIDTH,
                card,
                hoveredCardUid,
            }),
            { x, y }
        )
    })

    const root = Container({
        name: 'Player Hand Container',
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    }) as PixiContainerWithTweenableChildren

    bindHandAnimations(root, hoveredCardUid)

    return root
}

function bindHandAnimations(
    rootEl: PixiContainerWithTweenableChildren,

    hoveredCardUid: Datum<CardUid | null>
) {
    const initialDisplayVals = getInitialDisplayVals(rootEl)

    const unfocus = getUnfocus(rootEl, initialDisplayVals)
    const focus = getFocus(rootEl, initialDisplayVals)

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
                unfocus()
                return
            }

            focus(uid)
        })
    )

    onDestroyed(rootEl, ...unsubs)
}

interface InitialDisplayVal {
    x: number
    y: number
    rotation: number
    scale: number
}

function getInitialDisplayVals(
    rootEl: PixiContainerWithTweenableChildren
): InitialDisplayVal[] {
    return rootEl.children.map((c: PixiContainer) => {
        return {
            x: c.x,
            y: c.y,
            rotation: c.children[0].rotation,
            scale: c.children[0].scale.x,
        }
    })
}

function getUnfocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVal[]
): () => void {
    return () => {
        rootEl.children.forEach((cardEl: TweenablePixiContainer, i) => {
            const initialDisplayVal = initialDisplayVals[i]
            animateTo(cardEl, initialDisplayVal)
        })
    }
}

function getFocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVal[]
): (uid: CardUid) => void {
    return (uid: CardUid) => {
        const cardEl = rootEl.getChildByName(uid) as TweenablePixiContainer

        spreadOthers(rootEl, cardEl, initialDisplayVals)

        const initialDisplayVal =
            initialDisplayVals[rootEl.getChildIndex(cardEl)]

        animateTo(cardEl, {
            rotation: 0,
            x: initialDisplayVal.x + ADJUST_HOVERED_CARD_DISTANCE,
            y: initialDisplayVal.y - CARD_HEIGHT_FULL * 0.78,
            scale:
                (CARD_WIDTH_FULL / CARD_WIDTH_IN_HAND) *
                initialDisplayVal.scale,
        })
    }
}

const HAND_SPREAD_DISTANCE = 60
const ADJUST_HOVERED_CARD_DISTANCE = 40

function spreadOthers(
    rootEl: PixiContainerWithTweenableChildren,
    cardEl: TweenablePixiContainer,
    initialDisplayVals: InitialDisplayVal[]
) {
    const selectedCardIndex = rootEl.getChildIndex(cardEl)

    rootEl.children.forEach((cardEl: TweenablePixiContainer, i) => {
        if (i === selectedCardIndex) return

        const leftOrRight = i > selectedCardIndex ? 'left' : 'right' //cards laid right to left for energy corner

        animateTo(cardEl, {
            x:
                initialDisplayVals[i].x +
                (leftOrRight === 'left'
                    ? -HAND_SPREAD_DISTANCE
                    : HAND_SPREAD_DISTANCE),
            y: initialDisplayVals[i].y,
            rotation: initialDisplayVals[i].rotation,
            scale: initialDisplayVals[i].scale,
        })
    })
}

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
                filteredEl.filters = []
            }
        } else if (hoveredCharacterUid.val != null) {
            const card = getBattleScene()
                .select('cards', 'hand')
                .select(el.name as CardUid)
                .get()
            if (hoveredCharacterUid.val === card.characterUid) {
                filteredEl.filters = [glowFilter]
            } else {
                filteredEl.filters = []
            }
        } else {
            filteredEl.filters = []
        }
    })
}

function animateTo(
    cardEl: TweenablePixiContainer,
    displayVal: InitialDisplayVal
) {
    if (cardEl == null) return

    Tweener.killTweensOf(cardEl)
    Tweener.killTweensOf(cardEl.children[0])
    void Tweener.add(
        {
            target: cardEl,
            duration: 0.2,
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

function getXYRotationForNthCard(
    n: number,
    numCardsInHand: number
): XYRotation {
    // circular imports require defining constants here
    const RIGHT_TO_LEFT = 1
    const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
    const MAX_HAND_SIZE = 12
    const MAX_CARD_ROTATION = Math.PI * 0.1
    const Y_MAX_OFFSET = BASE_HEIGHT * 0.2
    const Y_MIN_OFFSET = BASE_HEIGHT * 0.15

    if (n < 1 || n > numCardsInHand)
        throw new Error(`n must be between 1 and numCardsInHand, value: ${n}`)

    const handWidth = Math.min(
        (numCardsInHand - 1) * CARD_WIDTH,
        MAX_HAND_WIDTH
    )

    const xPlacementPortion =
        RIGHT_TO_LEFT * 1 - (2 * (n - 1)) / Math.max(numCardsInHand - 1, 1) // -1 -> 1

    const endCardRotation =
        ((numCardsInHand - 1) / (MAX_HAND_SIZE - 1)) * MAX_CARD_ROTATION

    return assertFinite({
        x: handWidth * 0.5 * xPlacementPortion,
        y:
            -Y_MIN_OFFSET -
            (Y_MAX_OFFSET - Y_MIN_OFFSET) * (1 - Math.abs(xPlacementPortion)),
        rotation: xPlacementPortion * endCardRotation,
    })
}
