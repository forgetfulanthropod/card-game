import type { EffectId } from 'shared'
import type {
    cardArtAssets,
    cardTypeAssets,
    cardAssets,
    intentAssets,
    orbAssets,
    spineAssets,
} from './assetMaps'
import type { invisibleEffects_ } from './invisibleEffects'

export type CardArtAssetId = keyof typeof cardArtAssets
export type CardTypeAssetId = keyof typeof cardTypeAssets
export type CardAssetId = keyof typeof cardAssets
export type VisibleEffect = Exclude<EffectId, typeof invisibleEffects_[number]>
export type IntentAssetId = keyof typeof intentAssets
export type OrbAssetId = keyof typeof orbAssets
export type SpineAsset = keyof typeof spineAssets
export type AnimationId =
    | 'Attack'
    | 'Damage'
    | 'Idle'
    | RestSiteAnimationId
    | BattleSceneAnimationId
    | HexMapSceneAnimationId
export type RestSiteAnimationId = 'Position 1' | 'Position 2' | 'Position 3'
export type BattleSceneAnimationId = 'animation'
export type HexMapSceneAnimationId = 'animation'
