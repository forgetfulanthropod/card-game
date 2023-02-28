import {
    addFilterTo,
    getBooleanFromLocalStorage,
    getStage,
    PixiContainer,
    PixiSpine,
    removeFilterFrom,
} from '@/elementsUtil'
import { Tweener } from 'pixi-tweener'
import { ColorOverlayFilter } from 'pixi-filters'
export let enableMotionFX = getBooleanFromLocalStorage('enableMotionFX')


export const shakeScreen = (intensity: 1 | 2 | 3 | 4 | 5) => {
    enableMotionFX = getBooleanFromLocalStorage('enableMotionFX')
    if (!enableMotionFX) return

    const pixi = getStage()
    Tweener.add(
        { target: pixi, duration: 0.1 },
        {
            x: 50,
            y: 10,
        }
    )
        .then(() =>
            Tweener.add(
                { target: pixi, duration: 0.1 },
                {
                    x: -20,
                    y: -5,
                }
            )
        )
        .then(() =>
            Tweener.add(
                { target: pixi, duration: 0.1 },
                {
                    x: 0,
                    y: 0,
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
                    duration: 0.21,
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
