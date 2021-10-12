import { moveModiferMap, statsMap } from './battle/constants'
import { initialBattleState } from './battle/state'
import { Gamestate, Rulebook } from './datamodel'

export const initialGameState: Gamestate = {
    scene: initialBattleState,
    ownedCharacters: {},
    inventory: {},
}

export const rulebook: Rulebook = {
    characters: statsMap,
    moveModifiers: moveModiferMap,
    recipes: {},
    locations: {},
    items: {},
}
