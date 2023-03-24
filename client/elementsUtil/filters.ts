import { GlowFilter, AdjustmentFilter } from 'pixi-filters'
import { Filter } from 'pixi.js'
import {
    getBooleanFromLocalStorage,
    PixiContainer,
    PixiSpine,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { Easing, Tweener } from 'pixi-tweener'
const isHighResolution = getBooleanFromLocalStorage('isHighResolution')

export const glowFilter = new GlowFilter({
    innerStrength: 0,
    outerStrength: 6,
    distance: 22,
    color: 0xffffff,
    knockout: false,
})

glowFilter.resolution = isHighResolution ? 2 : 1

export const customGlowFilter = (color: number, outerStrength?: number) => {
    const filter = new GlowFilter({
        innerStrength: 0,
        outerStrength: outerStrength ?? 1,
        distance: 22,
        color,
        knockout: false,
    })

    filter.resolution = isHighResolution ? 2 : 1
    return filter
}

export const flashGlowAndBrightnessTo = async (
    Element: TweenablePixiContainer | PixiContainer,
    fadeOutDuration: number = 0.5
) => {
    const tempGlowFilter = new GlowFilter({
        innerStrength: 0,
        outerStrength: 6,
        distance: 22,
        color: 0xffffff,
        knockout: false,
        alpha: 0,
    })

    const bloomFilter = new AdjustmentFilter({
        brightness: 1,
    })

    const existingFilters = Element.filters
    if (existingFilters)
        Element.filters = [bloomFilter, tempGlowFilter, ...existingFilters]
    else Element.filters = [bloomFilter, tempGlowFilter]

    Tweener.add(
        { target: bloomFilter, duration: 0.05 },
        {
            brightness: 1.15,
        }
    )

    await Tweener.add(
        //@ts-ignore
        { target: tempGlowFilter, duration: 0.05 },
        {
            alpha: 0.9,
        }
    )

    Tweener.add(
        {
            target: bloomFilter,
            duration: fadeOutDuration,
            ease: Easing.easeFromTo,
        },
        {
            brightness: 1,
        }
    )

    await Tweener.add(
        {
            //@ts-ignore
            target: tempGlowFilter,
            duration: fadeOutDuration,
            ease: Easing.easeFromTo,
        },
        {
            alpha: 0,
        }
    )

    bloomFilter.destroy()
    tempGlowFilter.destroy()
    if (existingFilters) Element.filters = [...existingFilters]
    else Element.filters = []
}

export const removeFilterFrom = <T extends Filter>(
    root: PixiSpine,
    filterToRemove: T
) => {
    if (root.filters) {
        root.filters = root.filters.filter(
            existingFilter => existingFilter !== filterToRemove
        )
    } else {
        root.filters = null
    }
}

export const addFilterTo = <T extends Filter>(root: PixiSpine, filter: T) => {
    if (!root.filters) {
        root.filters = [filter]
    } else {
        root.filters.push(filter)
    }
}
