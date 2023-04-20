import {
    addFilterTo,
    getBooleanFromLocalStorage,
    getStage,
    PixiContainer,
    PixiSpine,
    removeFilterFrom,
} from '@/elementsUtil'
import { Easing, Tweener } from 'pixi-tweener'
import { ColorOverlayFilter } from 'pixi-filters'
import { random } from 'lodash'
export let enableMotionFX = getBooleanFromLocalStorage('enableMotionFX')

export const shakeScreen = (intensity: 1 | 2 | 3 | 4 | 5, isPc: boolean) => {
    enableMotionFX = getBooleanFromLocalStorage('enableMotionFX')
    if (!enableMotionFX) return

    const pixi = getStage()
    const runSceneManager = pixi.getChildAt(0) as PixiContainer
    const ifContainer = runSceneManager.getChildAt(0) as PixiContainer
    const battleScene = ifContainer.getChildAt(0) as PixiContainer
    const mainContainer = battleScene.getChildByName('CharactersAndBg')!

    let x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number = 0,
        y3: number = 0

    if (isPc) {
        x1 = random(-10, -30)
        y1 = random(-5, 5)

        x2 = random(10, 20)
        y2 = random(-5, 5)
    } else {
        x1 = random(10, 30)
        y1 = random(-5, 5)

        x2 = random(-10, -20)
        y2 = random(-5, 5)
    }

    const duration = 0.1

    Tweener.add(
        {
            target: mainContainer,
            duration: duration,
            ease: Easing.easeFrom,
        },
        {
            x: x1,
            y: y1,
        }
    )
        .then(() =>
            Tweener.add(
                { target: mainContainer, duration: duration * 1.5 },
                {
                    x: x2,
                    y: y2,
                }
            )
        )
        .then(() =>
            Tweener.add(
                {
                    target: mainContainer,
                    duration: duration * 3,
                    ease: Easing.easeTo,
                },
                {
                    x: x3,
                    y: y3,
                }
            )
        )
}

export const flashDamageOverlayTo = (character: PixiSpine) => {
    const whiteOverlayFilter = new ColorOverlayFilter(0xffffff, 1)
    const redDamageFilter = new ColorOverlayFilter(0xff0000, 0)

    // flash and decrease
    addFilterTo(character, whiteOverlayFilter)
    Tweener.add(
        {
            target: whiteOverlayFilter,
            duration: 0.09,
        },
        {
            alpha: 0,
        }
    ).then(() => {
        removeFilterFrom(character, whiteOverlayFilter)
        whiteOverlayFilter.destroy()
    })

    // stall and fade into
    addFilterTo(character, redDamageFilter)
    Tweener.add(
        {
            target: redDamageFilter,
            duration: 0.03,
        },
        {}
    )
        .then(() =>
            Tweener.add(
                {
                    target: redDamageFilter,
                    duration: 0.09,
                },
                {
                    alpha: 0.5,
                }
            )
        )
        .then(() =>
            Tweener.add(
                {
                    target: redDamageFilter,
                    duration: 0.33,
                },
                {
                    alpha: 0,
                }
            )
        )
        .then(() => {
            removeFilterFrom(character, redDamageFilter)
            redDamageFilter.destroy()
        })
}
