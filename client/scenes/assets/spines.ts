export const spineAssets = {
    frogKnightSpine: 'spine/frogKnight/FrogKnight.json',
    mushroomFarmerSpine:
        'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.json',
    skeletonWarriorSpine:
        'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.json',
    matchaGelatinCubeSpine:
        'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.json',
} as const

export type SpineAsset = keyof typeof spineAssets

// eslint-disable-next-line unused-imports/no-unused-vars
export type AnimationsOf<T extends SpineAsset> = 'Attack' | 'Damage' | 'Idle'

// export const animationsOf = {
//     frogKnightSpine: ['Attack', 'Damage', 'Idle'],
//     mushroomFarmer: ['Attack', 'Damage', 'Idle'],
//     skeletonWarriorSpine: ['Attack', 'Damage', 'Idle'],
// } as const

// export type AnimationsOf<K extends SpineAsset> = typeof animationsOf[K][number]
