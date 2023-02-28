import { GlowFilter } from 'pixi-filters'
import { Filter } from 'pixi.js'
import { getBooleanFromLocalStorage, PixiSpine } from '@/elementsUtil'
const isHighResolution = getBooleanFromLocalStorage('isHighResolution')

export const glowFilter = new GlowFilter({
    innerStrength: 0,
    outerStrength: 6,
    distance: 22,
    color: 0xffffff,
    knockout: false,
})

glowFilter.resolution = isHighResolution ? 2 : 1

export const customGlowFilter = (color: number) => {
    const filter = new GlowFilter({
        innerStrength: 0,
        outerStrength: 1,
        distance: 22,
        color,
        knockout: false,
    })

    filter.resolution = isHighResolution ? 2 : 1
    return filter
}

export const removeFilterFrom = <T extends Filter>(
    root: PixiSpine,
    filterToRemove: T
) => {
    if (root.filters) {
        root.filters = root.filters.filter(existingFilter => existingFilter !== filterToRemove)
    } else {
        root.filters = null
    }
}

export const addFilterTo = <T extends Filter>(
    root: PixiSpine,
    filter: T
) => {
    if (!root.filters) {
        root.filters = [filter]
    } else {
        root.filters.push(filter)
    }
}
