import { warhog } from './data'
import { rollTalents, rollComponents, rollMasterRarity } from './data/rarities'
import { randomValue, rollWeights } from './data/util'
import { calculateStats, rollStats, speciesClassCDF } from './data/stats'
// import { Spine, Skin } from '@pixi-spine/all-4.1'

import type { Species } from './data/stats'
import type { Rarity } from './data/rarities'

export const kaijus = [warhog]

export const kaijuSpineMap: Record<string, string> = {
    warhog: 'warhogGenOne',
}

export const rollCharacter = (kaijuOverride?: any, rarityOverride?: Rarity) => {
    const kaiju = kaijuOverride ? kaijuOverride : randomValue(kaijus)
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
    }
    const skin = {
        spine: kaijuSpineMap[kaiju.species],
        base: { rarity: masterRarity, name: skinBase.base },
        ...rollComponents(components, masterRarity),
    }

    const stats = rollStats(character.species, masterRarity)
    const calculatedStats = calculateStats(stats)

    const talents = rollTalents(
        character.species,
        character.class,
        masterRarity
    )

    character = { ...character, skin, stats, calculatedStats, talents }
    return character
}

// export const makeSkin = (character: Spine, skinInfo: any): Skin => {
//     const newSkin = new Skin('combined-skin')
//     const skinName = skinInfo.base.name
//     newSkin.addSkin(character.spineData.findSkin(skinName))
//     const components = Object.entries(skinInfo).filter(
//         ([k, v]: [any, any]) => k !== 'path' && k !== 'base'
//     )
//     for (const [key, data] of components) {
//         const componentName = (data as Item).name
//         try {
//             newSkin.addSkin(character.spineData.findSkin(componentName))
//         } catch (e) {
//             const err = e as unknown as Error
//             console.error(`error: couldn't find skin ${componentName}`)
//         }
//     }
//     return newSkin
// }
