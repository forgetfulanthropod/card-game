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
    penguinKnight: [
        {
            name: 'Better Together',
        },
        {
            name: 'Feathered Fortress',
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
    skeletonWarrior: [
        {
            name: 'Xylophone Bones',
        },
        {
            name: 'Chilling Premonition',
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
            name: 'Irresistible Target',
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
    snacky: [
        {
            name: 'a',
        },
        {
            name: 'b',
        },
    ],
    notoriousBean: [
        {
            name: 'a',
        },
        {
            name: 'b',
        },
    ],
}
