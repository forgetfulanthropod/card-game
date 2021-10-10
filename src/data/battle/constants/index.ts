import { Immutable } from 'config/immutable'
import { CharacterAssetKey } from 'features/battle/logic/AssetLoader'

export * from './moveTypeMetaMap'
export * from './numbers'
export * from './stanceTypeMetaMap'
export * from './statsMap'

interface MoveMetaI {
    id: MoveType
    numTargets: number
    multiplier: number
    defaultSpriteUrl?: string
    isSpecial?: boolean
}
export type MoveMeta = Immutable<MoveMetaI>

interface CharacterMoveI {
    name: string
    types: MoveType[]
}
export type CharacterMove = Immutable<CharacterMoveI>

interface CharacterStatsI {
    assetId: CharacterAssetKey
    type: string
    points: number
    maxHealth: number // AKA base health
    damage: number // AKA base attack
    moves: CharacterMove[]
    level: number
    modifier: number
}
export type CharacterStats = Immutable<CharacterStatsI>
