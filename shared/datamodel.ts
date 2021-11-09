// A name is something like "Skeleton" or "Frogknight"
// There can be multiple skeletons though so each one also has a unique ID (uid)
// The Rulebook exclusively uses names; the gamestate uses names for rulebook data, and uid for its own data
// The gamestate reads from the rulebook, but not vice versa
import type { BattleScene, CharacterName, DungeonRooms, EntryScene, EventTriggersMap, MoveMeta, MoveMetaName, NetworkAttackData, SpecialDoorName, StanceName, StanceStats } from '.'
import type { NetworkEvent, WorldEvent } from './networkEvents'


export type CharacterUid = string

export type ItemName = string
export type ItemUid = string
type LocationName = string
type RecipeName = string

export type Rulebook = Readonly<RulebookI>
interface RulebookI {
    version: string
    savedAt?: string
    name: string
    characters: Record<CharacterName, CharacterStats>
    moveMetaMap: Record<MoveMetaName, MoveMeta>
    blessings: Record<BlessingName, Blessing>
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

export type Gamestate = Readonly<GamestateI>
interface GamestateI {
    scene: Scene
    ownedCharacters: Record<CharacterUid, OwnedCharacter>
    inventory: Record<ItemUid, ItemName>
    blessings: Blessing[]
    events: {
        move: NetworkEvent<'move', NetworkAttackData>[]
        world: WorldEvent[]
    }
    rulebooks?: string[]
    curRulebook?: string
}

export type OwnedCharacter = Readonly<OwnedCharacterI>
interface OwnedCharacterI extends CharacterStatsI {
    uid: string
    tokenId: string
    nftName: string
}
export type SceneHas = Readonly<SceneHasI>
interface SceneHasI {
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


export type CharacterStats = Readonly<CharacterStatsI>
interface CharacterStatsI {
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
export type CharacterMove = Readonly<CharacterMoveI>
interface CharacterMoveI {
    name: string
    types: MoveMetaName[]
    damageRange?: number[]
}

export type LearnableCharacterMove = Readonly<LearnableCharacterMoveI>
interface LearnableCharacterMoveI extends CharacterMoveI {
    minLevel: number
}
export type Door = 'A' | 'B' | 'C' | 'D' | 'random'

export type DungeonLevel = Readonly<DungeonLevelI>
interface DungeonLevelI {
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

type TargetType = 'party' | 'enemies'

export type Blessing = {
    name: string,
    displayName?: string,
    after?: {
        doorType?: SpecialDoorName
    }
    effects: {
        target: TargetType | { type: TargetType, characterType: CharacterName },
        healthMultiplicand?: number,
        healthAddend?: number,
        damageMultiplicand?: number,
        damageAddend?: number,
    }[],

}
export type BlessingName = 'ptbotflax' | 'strongPcs' | 'strongEnemies' | 'weakEnemies' | 'weakPcs'
export type NpcLevelStatsMap = Partial<Record<CharacterName, Record<number, { maxHealth: number, damage: number }>>>

export type StatsWithStance = CharacterStats & { stance: StanceName }
