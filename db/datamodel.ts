import { CharacterAssetKey } from '@/features/battle/logic/AssetLoader'
// A name is something like "Skeleton" or "Frogknight"
// There can be multiple skeletons though so each one also has a unique ID (uid)
// The Rulebook exclusively uses names; the gamestate uses names for rulebook data, and uid for its own data
// The gamestate reads from the rulebook, but not vice versa
import { BattleScene, MoveModifier } from './battle/types'
import { EntryState } from './entry/types'

export * from './battle/types'

export type MoveUid = string
export type CharacterUid = string
export type CharacterName = string

type ItemName = string
type MoveModifierName = string
type ItemUid = string
type LocationName = string
type RecipeName = string

export interface Rulebook {
    characters: Record<CharacterName, CharacterStats>
    moveModifiers: Record<MoveModifierName, MoveModifier>
    recipes: Record<RecipeName, { name: RecipeName, ingredients: ItemName[], result: ItemName }>
    locations: Record<LocationName, {
        displayName: string
        name: LocationName
    }>
    items: Record<ItemName, {
        name: ItemName
        displayName: string
        description: string
    }>
}
export interface Gamestate {
    currentScene: Scene
    ownedCharacters: Record<CharacterUid, CharacterName>
    inventory: Record<ItemUid, ItemName>
}

export interface SceneHas {
    name: SceneName
}

interface MapScene extends SceneHas {
    name: 'map'
    coordinates: [number, number]
    unlockedLocations: LocationName[]
}
interface CraftingScene extends SceneHas {
    name: 'craft'
    onTable: Record<ItemUid, { row: number, col: number }>
    selectedRecipe: RecipeName
}



export type SceneName = 'map' | 'craft' | 'entry' | 'battle'
export type Scene = MapScene | BattleScene | CraftingScene | EntryState


export interface CharacterStats {
    assetId: CharacterAssetKey
    type: CharacterName
    points: number
    maxHealth: number // AKA base health
    damage: number // AKA base attack
    moves: CharacterMove[]
    level: number
    modifier: number
}
export interface CharacterMove {
    name: string
    types: MoveModifierName[]
}
