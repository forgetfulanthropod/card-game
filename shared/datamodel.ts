// A name is something like "Skeleton" or "Frogknight"
// There can be multiple skeletons though so each one also has a unique ID (uid)
// The Rulebook exclusively uses names; the gamestate uses names for rulebook data, and uid for its own data
// The gamestate reads from the rulebook, but not vice versa
import type {
    BattleScene,
    CharacterName,
    DungeonRooms,
    EntryScene,
    EventTriggersMap,
    MoveMeta,
    MoveMetaName,
    SpecialDoorName,
    StanceName,
    StanceStats,
} from '.'

export type CharacterUid = string & Brandify
export type CardUid = string & Brandify
export type PileId = 'draw' | 'hand' | 'discard' | 'removed'

export type ItemName = string & Brandify
export type ItemUid = string & Brandify
type LocationName = string & Brandify
type RecipeName = string & Brandify

/** Intersecting a type with this makes the type not get aliased to its definition by typescript & vscode. Useful for e.g. auto-refactors and function return types. */
type Brandify = {
    ___?: undefined
}

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    shouldCoinFlipEveryRound: boolean
    characters: Record<CharacterName, CharacterStats>
    moveMetaMap: Record<MoveMetaName, MoveMeta>
    blessings: Record<BlessingName, Blessing>
    recipes: Record<
        RecipeName,
        { name: RecipeName; ingredients: ItemName[]; result: ItemName }
    >
    locations: Record<
        LocationName,
        {
            displayName: string
            name: LocationName
        }
    >
    npcLevelStatsMap: NpcLevelStatsMap
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRooms
    items: Record<
        ItemName,
        {
            name: ItemName
            displayName: string
            description: string
        }
    >
    stanceTypeMetaMap: Record<StanceName, StanceStats>
    levelThresholds: Record<number, number>
    // npcNames: CharacterName[]
    specialDoorsMap: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    eventTriggersMap: EventTriggersMap
}> &
    Brandify

export type Gamestate = Readonly<{
    scene: Scene
    ownedCharacters: Record<CharacterUid, OwnedCharacter>
    inventory: Record<ItemUid, ItemName>
    coin: number
    blessings: Blessing[]
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    username: string
}> &
    Brandify

export type OwnedCharacter = CharacterStats &
    Readonly<{
        uid: string
        tokenId: string
        nftName: string
    }> &
    Brandify

export type SceneHas = Readonly<{
    name: SceneName
}> &
    Brandify

interface MapScene extends SceneHas {
    name: 'map'
    coordinates: [number, number]
    unlockedLocations: LocationName[]
}
interface CraftingScene extends SceneHas {
    name: 'craft'
    onTable: Record<ItemUid, { row: number; col: number }>
    selectedRecipe: RecipeName
}

export type SceneName = 'map' | 'craft' | 'entry' | 'battle'
export type Scene = MapScene | BattleScene | CraftingScene | EntryScene

export type CharacterStats = Readonly<{
    name: CharacterName
    displayName: string
    points: number
    isPc: boolean

    maxHealth: number // deprecated
    damage: number // deprecated

    constitution: number
    strength: number
    magic: number
    dexterity: number

    moves: CharacterMove[]
    learnableMoves?: LearnableCharacterMove[]
    level: number
    modifier: number
}> &
    Brandify
export type CharacterMove = Readonly<{
    name: string
    types: MoveMetaName[]
    damageRange?: number[]
}> &
    Brandify

type LearnableCharacterMove = CharacterMove &
    Readonly<{
        minLevel: number
    }> &
    Brandify
export type Door = 'A' | 'B' | 'C' | 'D' | 'random'

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
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

export type Blessing = Readonly<{
    name: string
    displayName?: string
    after?: {
        doorType?: SpecialDoorName
    }
    effects: {
        target: TargetType | { type: TargetType; characterType: CharacterName }
        healthMultiplicand?: number
        healthAddend?: number
        damageMultiplicand?: number
        damageAddend?: number
    }[]
}> &
    Brandify
export type BlessingName =
    | 'ptbotflax'
    | 'strongPcs'
    | 'strongEnemies'
    | 'weakEnemies'
    | 'weakPcs'
export type NpcLevelStatsMap = Readonly<
    Partial<
        Record<
            CharacterName,
            Record<number, { maxHealth: number; damage: number }>
        >
    >
> &
    Brandify

export type StatsWithStance = CharacterStats &
    Readonly<{ stance: StanceName }> &
    Brandify
