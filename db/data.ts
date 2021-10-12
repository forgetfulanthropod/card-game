import { moveModiferMap, stanceTypeMetaMap, statsMap } from './battle/constants'
import { initialBattleState, numbers } from './battle/state'
import { Gamestate, Rulebook } from './datamodel'
import { initialEntryState } from './entry/state'


export const rulebook: Rulebook = {
    characters: statsMap,
    moveModifiers: moveModiferMap,
    recipes: {},
    locations: {},
    items: {},
    initialScenes: {
        battle: initialBattleState,
        entry: initialEntryState,
        map: { name: 'map', coordinates: [-1, -1], unlockedLocations: [] },
        craft: { name: 'craft', onTable: {}, selectedRecipe: '' },
    },
    numbers,
    stanceTypeMetaMap,
    moveModiferMap,
}

export const initialGameState: Gamestate = {
    scene: rulebook.initialScenes.battle,
    ownedCharacters: {},
    inventory: {},
}
