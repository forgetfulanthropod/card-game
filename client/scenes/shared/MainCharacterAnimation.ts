import { Assets } from 'pixi.js'
import type { CharacterId, CharacterMeta, CharacterUid } from 'shared'
import { getValidSpineAssetName } from '@/assets'
import { hoveredCharacterUid } from '@/util'
import {
    addFilterTo,
    InteractionEvents,
    PixiSpine,
    removeFilterFrom,
} from '@/elementsUtil'
import { onDestroyed, glowFilter, Spine } from '@/elementsUtil'
import { Skin } from '@pixi-spine/all-4.1'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic'
export type Item = {
    rarity: Rarity
    name: string
}
const rarityOrder: Array<Rarity> = ['common', 'uncommon', 'rare', 'epic']

export const makeSkin = (character: PixiSpine, skinInfo: any): Skin => {
    const newSkin = new Skin('combined-skin')
    const skinName = skinInfo.base.name
    newSkin.addSkin(character.spineData.findSkin(skinName))
    const components = Object.entries(skinInfo).filter(
        ([k, v]: [any, any]) => k !== 'path' && k !== 'base' && k != 'spine'
    )
    for (const [key, data] of components) {
        const componentName = (data as Item).name
        try {
            newSkin.addSkin(character.spineData.findSkin(componentName))
        } catch (e) {
            const err = e as unknown as Error
            console.error(`error: couldn't find skin ${componentName}`)
        }
    }
    return newSkin
}

export function MainCharacterAnimation({
    characterMeta,
    events = {},
    _height = 190,
    _centerX = false,
    onSpineEvent,
}: {
    characterMeta: Pick<CharacterMeta, 'id' | 'isPc' | 'uid'>
    events?: InteractionEvents

    onSpineEvent?: (e: string) => void
    _height?: number
    _centerX?: boolean
}): PixiSpine | null {
    // @ts-expect-error
    const assetKey = characterMeta.skin
        ? // @ts-expect-error
          characterMeta.skin.spine
        : characterMeta.id
    const spineAssetName = getValidSpineAssetName(assetKey, characterMeta.isPc)

    // debug
    // console.log({ spineAssetName })

    if (!spineAssetName) return null

    const pointerenter = () => hoveredCharacterUid.set(characterMeta.uid)
    const pointerleave = () => {
        if (characterMeta.uid == hoveredCharacterUid.val)
            hoveredCharacterUid.set(null)
    }
    const basicEvents = {
        pointerenter,
        pointerleave,
    }

    const root = Spine({
        name: spineAssetName,
        animation: 'Idle',
        events: {
            ...basicEvents,
            ...events,
        },
        onSpineEvent,
        onDestroy: [hoveredCharacterUid.onChange(updateGlow)],
        isPc: characterMeta.isPc,
    })
    // @ts-expect-error
    if (characterMeta.skin) {
        // @ts-expect-error
        const skin = makeSkin(root, characterMeta.skin)
        // @ts-expect-error
        root.skeleton.setSkin(null)
        root.skeleton.setToSetupPose()
        root.skeleton.setSkin(skin)
    }

    // }
    // else {
    //     const characterSpine = new Spine(resource[assets['genHog']].spineData)
    //     root = new PixiSpine()
    // }

    const timeoutId = setTimeout(() => {
        root.state.setAnimation(0, 'Idle', true).mixDuration = 0.2
    }, Math.random() * 2000)

    // DEBUG
    // console.log({
    //     name: characterMeta.id,
    //     spine: root,
    //     skeleton: root.skeleton,
    // })

    onDestroyed(root, () => clearTimeout(timeoutId))

    updateGlow(hoveredCharacterUid.val)

    // const heightOverrides: Partial<Record<CharacterId, number>> = {
    //     matchaGelatinCube: 0.78,
    //     frogKnight: 1.4,
    //     warhog: 0.8,
    //     jerry: 1.2,
    //     gnomeHooligan: 1.2,
    //     penguinKnight: 1.2,
    //     skeletonWarrior: 0.75,
    // }

    // //@ts-expect-error
    // const desiredHeight = (heightOverrides?.[characterMeta.id] ?? 1) * height // TODO: what is it tho
    // const desiredScale = Math.min(
    //     desiredHeight / root.height,
    //     (desiredHeight * 1.2) / root.width
    // )
    const desiredScale = 0.0826 // 260/matcha height
    // console.log({ name: characterMeta.id, desiredScale })
    root.scale.set((characterMeta.isPc ? 1 : -1) * desiredScale, desiredScale)

    if (!characterMeta.isPc) {
        root.x -= root.width * 0.36
    }

    // if (centerX) root.x -= ((characterMeta.isPc ? 1 : -1) * root.width) / 2

    return root

    function updateGlow(hoveredCharacterUid: CharacterUid | null) {
        if (root == null) return
        if (hoveredCharacterUid === characterMeta.uid) {
            addFilterTo(root, glowFilter)
        } else {
            removeFilterFrom(root, glowFilter)
        }
    }
}
