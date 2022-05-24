import { pick } from 'lodash'
import { Tweener } from 'pixi-tweener'
import type { CardUid, Pile } from 'shared'
import { keys, vals } from 'shared/code'
import {
    Card,
    CARD_HEIGHT_FULL,
    CARD_WIDTH_FULL,
    CARD_WIDTH_IN_HAND,
} from './Card'
import { hoveredCardUid, hoveredCharacterUid } from '@/util'
import {
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

export function Hand(pile: Pile): PixiContainer {
    const cardUids = keys(pile)

    // const hoveredCardUid = datum<CharacterUid | null>(null)
    const children = vals(pile).map((card, index) => {
        return Card({
            index,
            pile,
            card,
            name: cardUids[index],
            // hoveredCardUid,
        })
    })

    const root = Container({
        name: 'Player Hand Container',
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    }) as PixiContainerWithTweenableChildren

    bindHandAnimations(root)

    return root
}

function bindHandAnimations(rootEl: PixiContainerWithTweenableChildren) {
    const initialDisplayVals = getInitialDisplayVals(rootEl)

    const unfocus = getUnfocus(rootEl, initialDisplayVals)
    const focus = getFocus(rootEl, initialDisplayVals)

    const unsubs: (() => void)[] = []
    unsubs.push(
        hoveredCharacterUid.onChange(_ => {
            updateGlowFilters(rootEl)
        })
    )

    unsubs.push(
        hoveredCardUid.onChange(uid => {
            updateGlowFilters(rootEl)

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

function updateGlowFilters(handEl: PixiContainerWithTweenableChildren) {
    handEl.children.forEach(el => {
        const filteredEl = (el as PixiContainer).children[0]
        if (hoveredCardUid.val != null) {
            if (hoveredCardUid.val === el.name) {
                filteredEl.filters = [glowFilter]
            } else {
                filteredEl.filters = []
            }
        } else if (hoveredCharacterUid.val != null) {
            if (hoveredCardUid.val === el.name) {
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
    initialDisplayVal: InitialDisplayVal
) {
    Tweener.killTweensOf(cardEl)
    Tweener.killTweensOf(cardEl.children[0])
    void Tweener.add(
        {
            target: cardEl,
            duration: 0.2,
        },
        {
            ...pick(initialDisplayVal, 'x', 'y'),
        }
    )
    void Tweener.add(
        {
            target: cardEl.children[0] as TweenablePixiContainer,
            duration: 0.1,
        },
        {
            ...pick(initialDisplayVal, 'rotation'),
            tweenableScale: initialDisplayVal.scale,
        }
    )
}
