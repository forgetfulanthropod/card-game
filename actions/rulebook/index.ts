/* eslint-disable simple-import-sort/imports */
import type { Gamestate, Rulebook } from '@shared/datamodel'
import { moveModiferMap, stanceTypeMetaMap, statsMap } from './battle'
import { makeInitialBattleState, numbers } from './battle/state'
import { initialEntryState } from './entry/state'
export const rulebook: Rulebook = {
    characters: statsMap,
    moveModifiers: moveModiferMap,
    recipes: {},
    locations: {},
    items: {},
    initialScenes: {
        battle: makeInitialBattleState(),
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
    ownedCharacters: { 'ownedCharacter1234': 'frogKnight' },
    inventory: {},
}
