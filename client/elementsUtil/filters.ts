import { GlowFilter } from 'pixi-filters'

export const glowFilter = new GlowFilter({
    innerStrength: 0,
    outerStrength: 2,
    color: 0xffffff,
    knockout: false,
})
