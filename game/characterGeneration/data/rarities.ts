import { CharacterClass, Species } from './stats'
import { numTalents, talentRarities } from './talents'
import { randomInteger, randomValue, rollNumber } from './util'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic'
export type Item = {
    rarity: Rarity
    name: string
}
const rarityOrder: Array<Rarity> = ['common', 'uncommon', 'rare', 'epic']

const masterRarities: Record<Rarity, number> = {
    common: -1,
    uncommon: 5169,
    rare: 9539,
    epic: 10000,
}

const rollRanges: Record<Rarity, Array<number>> = {
    common: [10000, 0, 0, 0],
    uncommon: [4000, 10000, 0, 0],
    rare: [1500, 5500, 10000, 0],
    epic: [0, 2500, 6000, 10000],
}

export const rollMasterRarity = (): Rarity => {
    const roll = rollNumber()
    for (const [rarity, value] of Object.entries(masterRarities)) {
        if (roll <= value) return rarity as Rarity
    }
    return 'common'
}

export const rollItemRarity = (master: Rarity): Rarity => {
    const ranges = rollRanges[master]
    const roll = rollNumber()
    for (const [idx, val] of ranges.entries()) {
        if (roll <= val) return rarityOrder[idx]
    }
    return 'common'
}

export const rollItem = (
    items: Record<Rarity, Array<string>>,
    masterRarity: Rarity,
    pity: boolean = false,
    filterOut: Item[] = []
): any => {
    const rarity = pity ? masterRarity : rollItemRarity(masterRarity)
    const pool = items[rarity].filter(
        v =>
            !Object.entries(filterOut)
                .map(([k, v]) => (v as Item).name)
                .includes(v)
    )
    const item = randomValue(pool)
    return {
        rarity: rarity,
        name: item,
    }
}

export const rollComponents = (
    components: Record<string, Record<Rarity, Array<string>>>,
    masterRarity: Rarity
) => {
    const items: Record<string, any> = {}
    const pitySlot = randomValue(Object.keys(components))
    let hasPity = true
    for (const [component, pools] of Object.entries(components)) {
        const item = rollItem(pools, masterRarity)
        if (item.rarity === masterRarity) hasPity = false
        items[component] = item
    }
    if (hasPity === true) {
        items[pitySlot] = rollItem(components[pitySlot], masterRarity, true)
    }
    return items
}

export const rollTalents = (
    species: Species,
    characterClass: CharacterClass,
    masterRarity: Rarity
) => {
    const pools: Record<Rarity, Array<string>> = Object.fromEntries(
        Object.entries(talentRarities).map(([k, v]) => {
            return [k, [...v['generic'], ...v[species], ...v[characterClass]]]
        })
    ) as Record<Rarity, Array<string>>

    const numAttributes = numTalents[masterRarity]
    const pitySlot = randomInteger(0, numAttributes - 1)
    let hasPity = true

    const talents = []
    for (let i = 0; i < numAttributes; i++) {
        const talent = rollItem(pools, masterRarity, false, talents)
        if (talent.rarity === masterRarity) hasPity = false
        talents.push(talent)
    }
    if (hasPity === true) {
        talents[pitySlot] = rollItem(pools, masterRarity, true, talents)
    }

    return talents
}
