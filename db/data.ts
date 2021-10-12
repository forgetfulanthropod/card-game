import { moveModiferMap, stanceTypeMetaMap, statsMap } from './battle/constants'
import { makeBattleState, numbers } from './battle/state'
import { Gamestate, Rulebook } from './datamodel'
import { initialEntryState } from './entry/state'


export const rulebook: Rulebook = {
    characters: statsMap,
    moveModifiers: moveModiferMap,
    recipes: {},
    locations: {},
    items: {},
    initialScenes: {
        battle: makeBattleState(),
        entry: initialEntryState,
        map: { name: 'map', coordinates: [-1, -1], unlockedLocations: [] },
        craft: { name: 'craft', onTable: {}, selectedRecipe: '' },
    },
    numbers,
    stanceTypeMetaMap,
    moveModiferMap,
}

export function initialOwnedCharacters() {
    return {
        'char-uid-8W2mG': { uid: 'char-uid-8W2mG', tokenId: '1234', nftName: 'Frog Knight #1234', ...statsMap.frogKnight }, // has everything for each character
        'char-uid-TLO0B': { uid: 'char-uid-TLO0B', tokenId: '1234', nftName: 'Mushroom Farmer #1234', ...statsMap.mushroomFarmer },
    }
}

export const initialGameState: Gamestate = {
    scene: rulebook.initialScenes.entry,
    // ownedCharacters: {},
    ownedCharacters: initialOwnedCharacters(),
    inventory: {},
}
