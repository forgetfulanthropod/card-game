export const spineAssets = {
    frogKnightSpine: 'spine/frogKnight/FrogKnight.json',
} as const

export type SpineAsset = keyof typeof spineAssets

export const animationsOf = {
    frogKnightSpine: ['Attack', 'Damage', 'Idle'],
} as const

export type AnimationsOf<K extends SpineAsset> = typeof animationsOf[K][number]
