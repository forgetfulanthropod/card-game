export const spineAssets = {
    frogKnightSpine: 'spine/frogKnight/FrogKnight.json',
    // mushroomFarmerSpine: 'spine/mushroomFarmer/MushroomFarmer.json',
    // skeletonWarriorSpine: 'spine/skeletonWarrior/SkeletonWarrior.json',
} as const

export type SpineAsset = keyof typeof spineAssets

// export const animationsOf = {
//     frogKnightSpine: ['Attack', 'Damage', 'Idle'],
//     mushroomFarmer: ['Attack', 'Damage', 'Idle'],
//     skeletonWarriorSpine: ['Attack', 'Damage', 'Idle'],
// } as const

// export type AnimationsOf<K extends SpineAsset> = typeof animationsOf[K][number]

// eslint-disable-next-line unused-imports/no-unused-vars
export type AnimationsOf<T extends SpineAsset> = 'Attack' | 'Damage' | 'Idle'
