/** This directory provides data and factories for initializing scenes  */
import type { Scene, SceneName } from '@shared/datamodel'

import { makeBattleState } from './battle/state'
import { initialEntryState } from './entry/state'

export const initialScenes: Record<SceneName, Scene> = {
    battle: makeBattleState(),
    entry: initialEntryState,
    map: { name: 'map', coordinates: [-1, -1], unlockedLocations: [] },
    craft: { name: 'craft', onTable: {}, selectedRecipe: '' },
}
