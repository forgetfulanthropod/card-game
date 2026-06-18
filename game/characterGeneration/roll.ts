import type { Species } from 'shared'

import { kaijus } from './data'
import { Rarity, rollTalents } from './data/rarities'
import { rollComponents, rollMasterRarity } from './data/rarities'
import { randomValue, rollWeights } from './data/util'
import { calculateStats, rollStats, speciesClassCDF } from './data/stats'

export const kaijuSpineMap: Record<string, string> = {
    frogKnight: 'frogKnightGenOne',
    penguinKnight: 'penguinKnightGenOne',
    warhog: 'warhogGenOne',
}

export const rollName = (kaiju: any): string => {
    const lastNameRoll = randomValue(kaiju.names.lastName1)
    const lastName = lastNameRoll.complete
        ? lastNameRoll.name
        : `${lastNameRoll.name}${randomValue(kaiju.names.lastName2)}`

    const name = kaiju.names
        ? `${randomValue(kaiju.names.firstName)} ${lastName}`
        : `Gen One ${kaiju.species}`
    return name
}

export const rollCharacter = (kaijuOverride?: any, rarityOverride?: Rarity, startPlain = false, startEnhanced = false) => {
    const kaiju = kaijuOverride
        ? kaijuOverride
        : randomValue(Object.values(kaijus))
    let character: Record<string, any> = {}
    character['level'] = 1
    character['species'] = kaiju.species

    let masterRarity = rarityOverride ? rarityOverride : rollMasterRarity()
    if (startPlain) masterRarity = 'common'
    if (startEnhanced) masterRarity = 'rare'
    character['rarity'] = masterRarity
    character['class'] = rollWeights(
        speciesClassCDF[character.species as Species]
    )
    const cosmeticPool = kaiju.skinMap[masterRarity] || kaiju.skinMap['common'] || kaiju.skinMap[Object.keys(kaiju.skinMap)[0]]
    const [skinName, skinBase] = randomValue(Object.entries(cosmeticPool))

    const components: Record<string, Record<Rarity, Array<string>>> = {
        ...skinBase.extra,
        ...kaiju.attachmentMap,
        ...(kaiju.classOverrides?.[character.class] ?? {}),
    }
    let skinComponents = rollComponents(components, masterRarity)
    if (startPlain) {
        // force the most basic (first) component per slot for plain start
        skinComponents = Object.fromEntries(
            Object.entries(components).map(([slot, byRarity]) => {
                const commons = (byRarity as any).common || []
                const chosen = commons[0] || Object.values(byRarity)[0]?.[0]
                return [slot, { rarity: 'common', name: chosen }]
            }).filter(([,v]) => (v as any).name )
        )
    }
    if (startEnhanced && !startPlain) {
        // bias to better parts for daily start
        skinComponents = rollComponents(components, 'epic')
    }
    const skin = {
        spine: kaijuSpineMap[kaiju.species],
        base: { rarity: masterRarity, name: skinBase.base },
        ...skinComponents,
    }

    const name = rollName(kaiju)
    const stats = rollStats(character.species, masterRarity)

    const talents = rollTalents(
        character.species,
        character.class,
        masterRarity
    )

    const calculatedStats = calculateStats(stats)

    if (startEnhanced) {
        // daily runs start enhanced and build power more quickly at the beginning
        Object.keys(calculatedStats).forEach(k => {
            ;(calculatedStats as any)[k] = Math.round(((calculatedStats as any)[k] || 0) * 1.25)
        })
    }

    character = { name, ...character, skin, stats, talents, calculatedStats }
    return character
}

export function upgradeCharacterSkin(currentSkin: any, species: string): any {
    if (!currentSkin || !currentSkin.spine) return currentSkin
    // simple progression: try to bump a component to higher variant if name has _0N
    const newSkin = { ...currentSkin }
    const slots = Object.keys(currentSkin).filter(k => k !== 'base' && k !== 'spine' && k !== 'path')
    if (slots.length === 0) return currentSkin
    const slot = slots[Math.floor(Math.random() * slots.length)]
    const cur = currentSkin[slot]?.name || ''
    // try bump number e.g. Body_01 -> Body_02 , Eye_01 -> Eye_02 etc.
    const m = cur.match(/^(.*_)(\d+)$/)
    if (m) {
        const nextNum = String(parseInt(m[2], 10) + 1).padStart(2, '0')
        const candidate = `${m[1]}${nextNum}`
        // accept if exists? for simplicity just use if plausible
        newSkin[slot] = { ...(currentSkin[slot] || {}), name: candidate, rarity: 'upgraded' }
    } else {
        // fallback append better
        newSkin[slot] = { ...(currentSkin[slot] || {}), name: cur.replace(/01|1$/, '02'), rarity: 'upgraded' }
    }
    return newSkin
}
