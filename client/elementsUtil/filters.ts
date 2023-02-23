import { GlowFilter } from 'pixi-filters'

export const glowFilter = new GlowFilter({
    innerStrength: 0,
    outerStrength: 6,
    distance: 22,
    color: 0xffffff,
    knockout: false,
})

export const customGlowFilter = (color: number) => {
    return new GlowFilter({
        innerStrength: 0,
        outerStrength: 1,
        distance: 22,
        color,
        knockout: false,
    })
}
