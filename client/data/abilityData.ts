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
    warhog: [
        {
            name: 'Irresistable Target',
        },
        {
            name: 'Growth Spurt',
        },
    ],
    gnomeHooligan: [
        {
            name: 'Born Lucky',
        },
        {
            name: 'Manic Hoarder',
        },
    ],
    jerry: [
        {
            name: 'Thousand Year Stare',
        },
        {
            name: 'Water Slide',
        },
    ],
}
