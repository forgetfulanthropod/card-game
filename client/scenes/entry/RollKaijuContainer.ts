import { getTexture, glowFilter, SouvenirAssetKey } from '@/elementsUtil'
import { Sprite } from 'pixi.js'
import { rollKaijuAtPlace } from './CharacterOptions'

export const RollKaijuContainer = () => {
    const src = getTexture('souvenirPlaceholder' as SouvenirAssetKey)
    const profile = new Sprite(src)
    profile.interactive = true

    const width = 115
    const margin = width * 0.2
    profile.position.set(width + margin, 54 + 5 * (width + margin))

    profile.on('pointerenter', e => {
        profile.filters = [glowFilter]
    })

    profile.on('pointerleave', e => {
        profile.filters = []
    })

    profile.on('pointerup', e => {
        rollKaijuAtPlace()
    })

    return profile
}
