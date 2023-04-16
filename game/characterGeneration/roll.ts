import { kaijus } from './data'
import { Rarity, rollTalents } from './data/rarities'
import { rollComponents, rollMasterRarity } from './data/rarities'
import { randomValue, rollWeights } from './data/util'
import { calculateStats, rollStats, speciesClassCDF } from './data/stats'

import type { Species } from './data/stats'

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

export const rollCharacter = (kaijuOverride?: any, rarityOverride?: Rarity) => {
    const kaiju = kaijuOverride
        ? kaijuOverride
        : randomValue(Object.values(kaijus))
    let character: Record<string, any> = {}
    character['level'] = 1
    character['species'] = kaiju.species

    const masterRarity = rarityOverride ? rarityOverride : rollMasterRarity()
    character['rarity'] = masterRarity
    character['class'] = rollWeights(
        speciesClassCDF[character.species as Species]
    )
    const cosmeticPool = kaiju.skinMap[masterRarity]
    const [skinName, skinBase] = randomValue(Object.entries(cosmeticPool))

    const components: Record<string, Record<Rarity, Array<string>>> = {
        ...skinBase.extra,
        ...kaiju.attachmentMap,
        ...(kaiju.classOverrides?.[character.class] ?? {}),
    }
    const skin = {
        spine: kaijuSpineMap[kaiju.species],
        base: { rarity: masterRarity, name: skinBase.base },
        ...rollComponents(components, masterRarity),
    }

    const name = rollName(kaiju)
    const stats = rollStats(character.species, masterRarity)
    const calculatedStats = calculateStats(stats)

    const talents = rollTalents(
        character.species,
        character.class,
        masterRarity
    )

    character = { name, ...character, skin, stats, calculatedStats, talents }
    return character
}
