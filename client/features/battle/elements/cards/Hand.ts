import { omit } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import type { CardUid, Pile } from 'shared'

import type { PixiContainer, TweenablePixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { hoveredCardUid, hoveredCharacterUid, keys, vals } from '@/util'

import type { PixiContainerWithTweenableChildren } from '../../../../elementsUtil/PixiContainerWithTweenableChildren'
import { glowFilter } from '../Character'
import {
    Card,
    CARD_HEIGHT_FULL,
    CARD_WIDTH_FULL,
    CARD_WIDTH_IN_HAND,
} from './Card'

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
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    }) as PixiContainerWithTweenableChildren

    bindHandAnimations(root)

    return root
}

function bindHandAnimations(rootEl: PixiContainerWithTweenableChildren) {
    console.log('ready to bind ' + rootEl.children.length + ' cards!!!')

    const initialDisplayVals = getInitialDisplayVals(rootEl)

    const unfocus = getUnfocus(rootEl, initialDisplayVals)
    const focus = getFocus(rootEl, initialDisplayVals)

    const unsubs: (() => void)[] = []
    unsubs.push(
        hoveredCharacterUid.onChange(uid => {
            updateGlowFilters(rootEl)
        })
    )

    unsubs.push(
        hoveredCardUid.onChange(uid => {
            console.log('hec card uid changed to', uid)
            if (uid == null) {
                unfocus()
                updateGlowFilters(rootEl)
                return
            }

            focus(uid)
            updateGlowFilters(rootEl)
        })
    )

    rootEl.on('destroyed', () => {
        unsubs.forEach(u => u())
    })
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
    return rootEl.children.map(c => {
        return {
            x: c.x,
            y: c.y,
            rotation: c.rotation,
            scale: c.scale.x,
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
            Tweener.killTweensOf(cardEl)
            void Tweener.add(
                {
                    target: cardEl,
                    duration: 0.2,
                },
                {
                    ...omit(initialDisplayVal, 'scale'),
                    tweenableScale: initialDisplayVal.scale,
                }
            )
        })
    }
}

function getFocus(
    rootEl: PixiContainerWithTweenableChildren,
    initialDisplayVals: InitialDisplayVal[]
): (uid: CardUid) => void {
    // let animationForCard = getNullAnimation()

    return (uid: CardUid) => {
        const cardEl = rootEl.getChildByName(uid) as TweenablePixiContainer

        spreadOthers(rootEl, cardEl, initialDisplayVals)

        const initialDisplayVal =
            initialDisplayVals[rootEl.getChildIndex(cardEl)]

        Tweener.killTweensOf(cardEl)

        void Tweener.add(
            {
                target: cardEl,
                duration: 0.13,
                ease: Easing.easeInOutCubic,
            },
            {
                x: initialDisplayVal.x + ADJUST_HOVERED_CARD_DISTANCE,
                y: -CARD_HEIGHT_FULL / 2 - ADJUST_HOVERED_CARD_DISTANCE,
                // rotation: 0,
                tweenableScale:
                    (CARD_WIDTH_FULL / CARD_WIDTH_IN_HAND) *
                    initialDisplayVal.scale,
                // scale: new Point(CARD_WIDTH_FULL / cardFrameTexture.width),
            }
        )
    }
}

const HAND_SPREAD_DISTANCE = 60
const ADJUST_HOVERED_CARD_DISTANCE = 40

function spreadOthers(
    root: PixiContainerWithTweenableChildren,
    cardEl: TweenablePixiContainer,
    initialDisplayVals: InitialDisplayVal[]
) {
    const selectedCardIndex = root.getChildIndex(cardEl)

    root.children.forEach((cardEl: TweenablePixiContainer, i) => {
        if (i === selectedCardIndex) return

        const leftOrRight = i > selectedCardIndex ? 'left' : 'right' //cards laid right to left for energy corner

        Tweener.killTweensOf(cardEl)

        void Tweener.add(
            {
                target: cardEl,
                duration: 0.15,
                ease: Easing.easeInOutCubic,
            },
            {
                x:
                    initialDisplayVals[i].x +
                    (leftOrRight === 'left'
                        ? -HAND_SPREAD_DISTANCE
                        : HAND_SPREAD_DISTANCE),
                y: initialDisplayVals[i].y,
                rotation: initialDisplayVals[i].rotation,
                tweenableScale: initialDisplayVals[i].scale,

                // tweenableScale: CARD_WIDTH_FULL / CARD_WIDTH_IN_HAND * initialDisplayVals[i].scale,
                // scale: new Point(CARD_WIDTH_FULL / cardFrameTexture.width),
            }
        )
    })
}

function updateGlowFilters(handEl: PixiContainerWithTweenableChildren) {
    handEl.children.forEach(el => {
        if (hoveredCardUid.val != null) {
            if (hoveredCardUid.val === el.name) {
                console.log('setting', { glowFilter, el })
                el.filters = [glowFilter]
            } else {
                el.filters = []
            }
        } else if (hoveredCharacterUid.val != null) {
            if (hoveredCardUid.val === el.name) {
                el.filters = [glowFilter]
            } else {
                el.filters = []
            }
        }
    })
}
