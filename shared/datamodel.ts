// A name is something like "Skeleton" or "Frogknight"
// There can be multiple skeletons though so each one also has a unique ID (uid)
// The Rulebook exclusively uses names; the gamestate uses names for rulebook data, and uid for its own data
// The gamestate reads from the rulebook, but not vice versa
import type { BattleScene, CharacterName, DungeonRooms, EntryScene, EventTriggersMap, MoveMeta, MoveMetaName, NetworkAttackData, StanceName, StanceStats } from '.'
import type { NetworkEvent, WorldEvent } from './networkEvents'


export type CharacterUid = string

export type ItemName = string
export type ItemUid = string
type LocationName = string
type RecipeName = string

export interface Rulebook {
    characters: Record<CharacterName, CharacterStats>
    moveMetaMap: Record<MoveMetaName, MoveMeta>
    recipes: Record<RecipeName, { name: RecipeName, ingredients: ItemName[], result: ItemName }>
    locations: Record<LocationName, {
        displayName: string
        name: LocationName
    }>,
    npcLevelStatsMap: NpcLevelStatsMap
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRooms
    items: Record<ItemName, {
        name: ItemName
        displayName: string
        description: string
    }>
    stanceTypeMetaMap: Record<StanceName, StanceStats>
    levelThresholds: Record<number, number>
    // npcNames: CharacterName[]
    specialDoorsMap: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    eventTriggersMap: EventTriggersMap
}

export interface Gamestate {
    scene: Scene
    ownedCharacters: Record<CharacterUid, OwnedCharacter>
    inventory: Record<ItemUid, ItemName>
    events: {
        move: NetworkEvent<'move', NetworkAttackData>[]
        world: WorldEvent[]
    }
}

export interface OwnedCharacter extends CharacterStats {
    uid: string
    tokenId: string
    nftName: string
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
export type Scene = MapScene | BattleScene | CraftingScene | EntryScene


export interface CharacterStats {
    name: CharacterName
    displayName: string
    points: number
    isPc: boolean
    maxHealth: number // AKA base health
    damage: number // AKA base attack
    moves: CharacterMove[]
    learnableMoves?: LearnableCharacterMove[]
    level: number
    modifier: number
}
export interface CharacterMove {
    name: string
    types: MoveMetaName[]
    damageRange?: number[]
}

export interface LearnableCharacterMove extends CharacterMove {
    minLevel: number
}
export type Door = 'A' | 'B' | 'C' | 'D' | 'random'

export interface DungeonLevel {
    name: DungeonName
    num: number
    pointLimit: number
    modifier: number
}

export type DungeonName =
    | 'Hooligan’s Bluff'
    | 'The Matcha Caves'
    | 'Fort Skeleton'
    | 'The Ninth Trash Hole of Hell'

export type NpcLevelStatsMap = Partial<Record<CharacterName, Record<number, { maxHealth: number, damage: number }>>>
