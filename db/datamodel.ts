// A name is something like "Skeleton" or "Frogknight"
// There can be multiple skeletons though so each one also has a unique ID (uid)
// The Rulebook exclusively uses names; the gamestate uses names for rulebook data, and uid for its own data
// The gamestate reads from the rulebook, but not vice versa

type Text = string
type List<T> = Array<T>
type ItemName = string
type MoveUid = string
type CharacterUid = string
type CharacterName = string
type MoveModifierName = string
type ItemUid = string
type LocationName = string
type RecipeName = string

export interface Rulebook {
    characters: Record<CharacterName, {
        name: CharacterName
        displayName: Text
        baseHealth: number
        assetUrl: Text
        points: number
        damage: number
        moves: { displayName: Text, modifiers: MoveModifierName[] }
        isNpcOnly: boolean
    }>
    moveModifiers: Record<MoveModifierName, {
        name: MoveModifierName
        displayName: Text
        numTargets: number
        multiplier: number
    }>
    recipes: Record<RecipeName, { name: RecipeName, ingredients: ItemName[], result: ItemName }>
    locations: Record<LocationName, {
        displayName: Text
        name: LocationName
    }>
    items: Record<ItemName, {
        name: ItemName
        displayName: Text
        description: Text
    }>
}
export interface Gamestate {
    currentScene: MapScene | BattleScene | CraftingScene
    ownedCharacters: Record<CharacterUid, CharacterName>
    inventory: Record<ItemUid, ItemName>
}
export interface BattleScene {
    name: 'battle'
    state: 'not started' | 'in battle' | 'won' | 'lost'
    isPlayerTurn: boolean
    allCharacters: Record<CharacterUid, CharacterState>
    selectedCharacter: CharacterUid
    selectedMove: MoveUid
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number

}
export interface CharacterState {
    name: CharacterName
    uid: CharacterUid
    health: number
    isNpc: boolean
    hasMoved: boolean
}
interface MapScene {
    name: 'map'
    coordinates: [number, number]
    unlockedLocations: LocationName[]
}
interface CraftingScene {
    name: 'craft'
    onTable: Record<ItemUid, { row: number, col: number }>
    selectedRecipe: RecipeName
}
