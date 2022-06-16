import type { EffectId } from 'shared'
import type {
    cardArtAssets,
    cardTypeAssets,
    cardAssets,
    invisibleEffects_,
    intentAssets,
    orbAssets,
    spineAssets,
} from './allMaps'

export type CardArtAssetId = keyof typeof cardArtAssets
export type CardTypeAssetId = keyof typeof cardTypeAssets
export type CardAssetId = keyof typeof cardAssets
export type VisibleEffect = Exclude<EffectId, typeof invisibleEffects_[number]>
export type IntentAssetId = keyof typeof intentAssets
export type OrbAssetId = keyof typeof orbAssets
export type SpineAsset = keyof typeof spineAssets
export type AnimationsOf<T extends SpineAsset> = 'Attack' | 'Damage' | 'Idle'
