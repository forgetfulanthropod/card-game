import type {
    CharacterId,
    CharacterStats,
    NonPlayerCharacterId,
    PlayerCharacterId,
    PlayerCharacterStats,
} from 'shared'

const unknownEnemyFiller = {
    class: 'knight',
    constitution: 100,
    strength: 20,
    magic: 5,
    defense: 5,
} as const

export const playerCharacterStatsMap: Record<
    PlayerCharacterId,
    PlayerCharacterStats
> = {
    bloatDemon: {
        id: 'bloatDemon',
        displayName: 'Bloat Demon',
        isPc: true,
        class: 'knight',

        constitution: 160,
        strength: 27,
        magic: 5,
        defense: 5,
    },
    bogSpirit: {
        id: 'bogSpirit',
        displayName: 'Bog Spirit',
        isPc: true,
        class: 'knight',

        constitution: 224,
        strength: 16,
        magic: 5,
        defense: 5,
    },
    bookle: {
        id: 'bookle',
        displayName: 'Bookle',
        isPc: true,
        class: 'knight',

        constitution: 60,
        strength: 10,
        magic: 5,
        defense: 5,
    },
    bumbit: {
        id: 'bumbit',
        displayName: 'Bumbit',
        isPc: true,
        class: 'knight',

        constitution: 58,
        strength: 18,
        magic: 5,
        defense: 5,
    },
    frogKnight: {
        id: 'frogKnight',
        displayName: 'Frog Knight',
        isPc: true,
        class: 'knight',

        constitution: 80,
        strength: 10,
        magic: 5,
        defense: 11,
    },
    frogWizard: {
        id: 'frogWizard',
        displayName: 'Frog Wizard',
        isPc: true,
        class: 'knight',

        constitution: 66,
        strength: 24,
        magic: 5,
        defense: 5,
    },
    gnomeHooligan: {
        id: 'gnomeHooligan',
        displayName: 'Gnome Hooligan',
        isPc: true,
        class: 'rogue',

        constitution: 40,
        strength: 12 + 1,
        magic: 14,
        defense: 5,
    },
    goblinDragon: {
        id: 'goblinDragon',
        displayName: 'Goblin Dragon',
        isPc: true,
        class: 'knight',

        constitution: 120,
        strength: 13,
        magic: 5,
        defense: 5,
    },
    greenJester: {
        id: 'greenJester',
        displayName: 'Green Jester',
        isPc: true,
        class: 'knight',

        constitution: 120,
        strength: 34,
        magic: 5,
        defense: 5,
    },
    jerry: {
        id: 'jerry',
        displayName: 'Jerry',
        isPc: true,
        class: 'wizard',

        constitution: 86,
        strength: 999,
        magic: 14,
        defense: 5 + 1,
    },
    lichLord: {
        id: 'lichLord',
        displayName: 'Lich Lord',
        isPc: true,
        class: 'knight',

        constitution: 250,
        strength: 27,
        magic: 5,
        defense: 5,
    },
    matchaGelatinCube: {
        id: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: false,
        class: 'cleric',

        constitution: 78 + 25,
        strength: 5 + 1,
        magic: 7 + 2,
        defense: 5 + 4,
    },
    mushroomFarmer: {
        id: 'mushroomFarmer',
        displayName: 'Mushroom Farmer',
        isPc: true,
        class: 'cleric',

        constitution: 112,
        strength: 8,
        magic: 9,
        defense: 6,
    },
    notoriousBean: {
        id: 'notoriousBean',
        displayName: 'Notorious B.E.A.N.',
        isPc: true,
        class: 'bard',

        constitution: 75,
        strength: 12,
        magic: 7,
        defense: 5,
    },
    orcWarrior: {
        id: 'orcWarrior',
        displayName: 'Orc Warrior',
        isPc: false,
        class: 'knight',

        constitution: 88,
        strength: 12,
        magic: 5,
        defense: 5,
    },
    penguinKnight: {
        id: 'penguinKnight',
        displayName: 'Penguin Knight',
        isPc: true,
        class: 'knight',

        constitution: 74,
        strength: 12,
        magic: 5,
        defense: 9,
    },
    skeletonWarrior: {
        id: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: false,
        class: 'knight',

        constitution: 54 + 4,
        strength: 11 + 3,
        magic: 4,
        defense: 4 + 3,
    },
    snacky: {
        id: 'snacky',
        displayName: 'Snacky',
        isPc: true,
        class: 'bard',

        constitution: 67,
        strength: 16,
        magic: 5,
        defense: 5,
    },
    theHatefly: {
        id: 'theHatefly',
        displayName: 'The Hatefly',
        isPc: true,
        class: 'knight',

        constitution: 300,
        strength: 22,
        magic: 5,
        defense: 5,
    },
    trioOfFools: {
        id: 'trioOfFools',
        displayName: 'Trio of Fools',
        isPc: true,
        class: 'knight',

        constitution: 110,
        strength: 15,
        magic: 5,
        defense: 5,
    },
    warhog: {
        id: 'warhog',
        displayName: 'Warhog',
        isPc: true,
        class: 'cleric',

        constitution: 84 + 40,
        strength: 6,
        magic: 7,
        defense: 5 + 3,
    },
    wimpyGuard: {
        id: 'wimpyGuard',
        displayName: 'Wimpy Guard',
        isPc: true,
        class: 'knight',

        constitution: 170,
        strength: 24,
        magic: 5,
        defense: 5,
    },
}
