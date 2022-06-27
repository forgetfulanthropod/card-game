import type { CharacterId } from 'shared'

export type Ability = { name: string }

export const characterIdToAbilitiesMap: Partial<
    Record<CharacterId, Ability[]>
> = {
    mushroomFarmer: [
        {
            name: 'Sleepy Time Spores',
        },
        {
            name: 'Slow but Purposeful',
        },
    ],
    skeletonWarrior: [
        {
            name: 'Xylophone Bones',
        },
        {
            name: 'Chilling Premonition',
        },
    ],
    frogKnight: [
        {
            name: 'Small but Stoic',
        },
        {
            name: 'Amphibious Vigor',
        },
    ],
    matchaGelatinCube: [
        {
            name: 'Friend and Snack',
        },
        {
            name: 'Impenetrable Gelatin',
        },
    ],
}
