import type { Rarity } from './rarities'
import { randomInteger, rollWeights, randomValue } from './util'

export type Stat = 'primary' | 'secondary' | 'tertiary1' | 'tertiary2'
export type StatName = 'strength' | 'magic' | 'defense' | 'constitution'
export type Species = 'frogKnight' | 'warhog' | 'penguinKnight'
export type CharacterClass = 'knight' | 'cleric' | 'bard' | 'rogue' | 'wizard'

const speciesStatBonus: Record<Species, Record<StatName, number>> = {
    frogKnight: {
        strength: 100,
        magic: 100,
        defense: 0,
        constitution: 0,
    },
    warhog: {
        strength: 0,
        magic: 0,
        defense: 100,
        constitution: 100,
    },
    penguinKnight: {
        strength: 50,
        magic: 50,
        defense: 100,
        constitution: 0,
    },
}

export const speciesClassCDF: Record<
    Species,
    Record<CharacterClass, number>
> = {
    warhog: { bard: -1, rogue: -1, cleric: 4500, wizard: 7250, knight: 10000 },
    frogKnight: {
        wizard: -1,
        bard: -1,
        cleric: 4500,
        knight: 7250,
        rogue: 10000,
    },
    penguinKnight: {
        bard: -1,
        cleric: -1,
        knight: 3333,
        rogue: 6666,
        wizard: 10000,
    },
}

export const rollClass = (species: Species): CharacterClass => {
    return rollWeights(speciesClassCDF[species]) as CharacterClass
}

const classStatOptions: Record<
    CharacterClass,
    Record<Stat, Array<StatName>>
> = {
    knight: {
        primary: ['strength', 'defense'],
        secondary: ['strength', 'defense'],
        tertiary1: ['magic', 'constitution'],
        tertiary2: ['magic', 'constitution'],
    },
    cleric: {
        primary: ['defense', 'constitution'],
        secondary: ['defense', 'constitution'],
        tertiary1: ['strength', 'magic'],
        tertiary2: ['strength', 'magic'],
    },
    bard: {
        primary: ['strength', 'magic'],
        secondary: ['strength', 'magic'],
        tertiary1: ['defense', 'constitution'],
        tertiary2: ['defense', 'constitution'],
    },
    rogue: {
        primary: ['strength'],
        secondary: ['defense', 'magic'],
        tertiary1: ['defense', 'magic', 'constitution'],
        tertiary2: ['defense', 'magic', 'constitution'],
    },
    wizard: {
        primary: ['magic'],
        secondary: ['constitution', 'defense', 'strength'],
        tertiary1: ['constitution', 'defense', 'strength'],
        tertiary2: ['constitution', 'defense', 'strength'],
    },
}

const statRanges: Record<Stat, [number, number]> = {
    primary: [9, 13],
    secondary: [7, 11],
    tertiary1: [6, 10],
    tertiary2: [6, 10],
}

const statScaling: Record<Rarity, Record<Stat, [number, number]>> = {
    common: {
        primary: [1000, 1000],
        secondary: [1000, 1000],
        tertiary1: [1000, 1000],
        tertiary2: [1000, 1000],
    },
    uncommon: {
        primary: [1050, 1050],
        secondary: [1000, 1050],
        tertiary1: [1000, 1050],
        tertiary2: [1000, 1050],
    },
    rare: {
        primary: [1060, 1100],
        secondary: [1050, 1100],
        tertiary1: [1025, 1100],
        tertiary2: [1025, 1100],
    },
    epic: {
        primary: [1100, 1150],
        secondary: [1050, 1150],
        tertiary1: [1050, 1100],
        tertiary2: [1050, 1100],
    },
}

export const rollStatValues = (rarity: Rarity) => {
    const scaling = statScaling[rarity]
    const stats = Object.fromEntries(
        Object.entries(statRanges).map(([stat, range]) => {
            return [
                stat as Stat,
                {
                    flat: randomInteger(...range),
                    scaling: randomInteger(...scaling[stat as Stat]),
                },
            ]
        })
    )
    return stats
}

export const rollStatNames = (
    characterClass: CharacterClass
): Record<Stat, StatName> => {
    const options = classStatOptions[characterClass]
    const statsNames: StatName[] = []
    statsNames.push(
        randomValue(options.primary.filter(k => !statsNames.includes(k)))
    )
    statsNames.push(
        randomValue(options.secondary.filter(k => !statsNames.includes(k)))
    )
    statsNames.push(
        randomValue(options.tertiary1.filter(k => !statsNames.includes(k)))
    )
    statsNames.push(
        randomValue(options.tertiary2.filter(k => !statsNames.includes(k)))
    )
    // return statsNames
    const statsNamesDict: Record<Stat, StatName> = {
        primary: statsNames[0],
        secondary: statsNames[1],
        tertiary1: statsNames[2],
        tertiary2: statsNames[3],
    }
    return statsNamesDict
}

export const rollStats = (species: Species, rarity: Rarity) => {
    const characterClass = rollClass(species)
    const statValues = rollStatValues(rarity)
    const statNames = rollStatNames(characterClass)
    const finalStats = {
        primary: {
            stat: statNames.primary,
            ...statValues.primary,
            bonusScaling: speciesStatBonus[species][statNames.primary],
        },
        secondary: {
            stat: statNames.secondary,
            ...statValues.secondary,
            bonusScaling: speciesStatBonus[species][statNames.secondary],
        },
        tertiary1: {
            stat: statNames.tertiary1,
            ...statValues.tertiary1,
            bonusScaling: speciesStatBonus[species][statNames.tertiary1],
        },
        tertiary2: {
            stat: statNames.tertiary2,
            ...statValues.tertiary2,
            bonusScaling: speciesStatBonus[species][statNames.tertiary2],
        },
    }
    return finalStats
}

export const calculateStats = (stats: any) => {
    return Object.fromEntries(
        Object.entries(stats).map(([k, v]: [any, any]) => {
            return [
                v.stat,
                (v.flat *
                    (v.scaling + v.bonusScaling) *
                    (v.stat === 'constitution' ? 8 : 1)) /
                    1000,
            ]
        })
    )
}
