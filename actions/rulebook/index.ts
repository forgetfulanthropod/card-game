/** This directory provides the data that populates the rulebook in the firestore */
/* eslint-disable simple-import-sort/imports */

import type { Rulebook } from '@shared/datamodel'
import { moveModiferMap, stanceTypeMetaMap, statsMap } from './battle'
import { numbers } from '../gameState/battle/state'
export const rulebook: Rulebook = {
    characters: statsMap,
    moveModifiers: moveModiferMap,
    recipes: {},
    locations: {},
    items: {},
    // initialScenes: {
    //     battle: makeBattleState(),
    //     entry: initialEntryState,
    //     map: { name: 'map', coordinates: [-1, -1], unlockedLocations: [] },
    //     craft: { name: 'craft', onTable: {}, selectedRecipe: '' },
    // },
    numbers,
    stanceTypeMetaMap,
    moveModiferMap,
    dungeonLevels: [],
}
