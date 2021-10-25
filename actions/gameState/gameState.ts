import type { Gamestate, OwnedCharacter } from '@shared'

import { statsMap } from '../rulebook/battle'
import { initialEntryState } from './entry/state'


export function initialOwnedCharacters(): Record<string, OwnedCharacter> {
    return {
        // 'char-uid-8W2mG': { uid: 'char-uid-8W2mG', tokenId: '1234', nftName: 'Frog Knight #1234', ...statsMap.frogKnight }, // has everything for each character
        // 'char-uid-TLO23': { uid: 'char-uid-TLO23', tokenId: '1234', nftName: 'Mushroom Farmer #1234', ...statsMap.mushroomFarmer },
        'char-uid-TLO0B': { uid: 'char-uid-TLO0B', tokenId: '1234', nftName: 'bloatDemon #1234', ...statsMap.bloatDemon },
        'char-uid-TLO1': { uid: 'char-uid-TLO1', tokenId: '1', nftName: 'bogSpirit #1234', ...statsMap.bogSpirit },
        'char-uid-TLO2': { uid: 'char-uid-TLO2', tokenId: '2', nftName: 'bookle #1234', ...statsMap.bookle },
        'char-uid-TLO3': { uid: 'char-uid-TLO3', tokenId: '3', nftName: 'bumbit #1234', ...statsMap.bumbit },
        'char-uid-TLO4': { uid: 'char-uid-TLO4', tokenId: '4', nftName: 'frogKnight #1234', ...statsMap.frogKnight },
        'char-uid-TLO5': { uid: 'char-uid-TLO5', tokenId: '5', nftName: 'frogWizard #1234', ...statsMap.frogWizard },
        'char-uid-TLO6': { uid: 'char-uid-TLO6', tokenId: '6', nftName: 'gnomeHooligan #1234', ...statsMap.gnomeHooligan },
        'char-uid-TLO7': { uid: 'char-uid-TLO7', tokenId: '7', nftName: 'goblinDragon #1234', ...statsMap.goblinDragon },
        'char-uid-TLO8': { uid: 'char-uid-TLO8', tokenId: '8', nftName: 'greenJester #1234', ...statsMap.greenJester },
        'char-uid-TLO9': { uid: 'char-uid-TLO9', tokenId: '9', nftName: 'jerry #1234', ...statsMap.jerry },
        'char-uid-TLO10': { uid: 'char-uid-TLO10', tokenId: '10', nftName: 'lichLord #1234', ...statsMap.lichLord },
        'char-uid-TLO11': { uid: 'char-uid-TLO11', tokenId: '11', nftName: 'matchaGelatinCube #1234', ...statsMap.matchaGelatinCube },
        'char-uid-TLO12': { uid: 'char-uid-TLO12', tokenId: '12', nftName: 'mimic #1234', ...statsMap.mimic },
        'char-uid-TLO13': { uid: 'char-uid-TLO13', tokenId: '13', nftName: 'mushroomFarmer #1234', ...statsMap.mushroomFarmer },
        'char-uid-TLO14': { uid: 'char-uid-TLO14', tokenId: '14', nftName: 'notoriousBEAN #1234', ...statsMap.notoriousBEAN },
        'char-uid-TLO15': { uid: 'char-uid-TLO15', tokenId: '15', nftName: 'orcWarrior #1234', ...statsMap.orcWarrior },
        'char-uid-TLO16': { uid: 'char-uid-TLO16', tokenId: '16', nftName: 'penguinKnight #1234', ...statsMap.penguinKnight },
        'char-uid-TLO17': { uid: 'char-uid-TLO17', tokenId: '17', nftName: 'skeletonWarrior #1234', ...statsMap.skeletonWarrior },
        'char-uid-TLO18': { uid: 'char-uid-TLO18', tokenId: '18', nftName: 'snacky #1234', ...statsMap.snacky },
        'char-uid-TLO19': { uid: 'char-uid-TLO19', tokenId: '19', nftName: 'theHatefly #1234', ...statsMap.theHatefly },
        'char-uid-TLO20': { uid: 'char-uid-TLO20', tokenId: '20', nftName: 'trioOfFools #1234', ...statsMap.trioOfFools },
        'char-uid-TLO21': { uid: 'char-uid-TLO21', tokenId: '21', nftName: 'warhog #1234', ...statsMap.warhog },
        'char-uid-TLO22': { uid: 'char-uid-TLO22', tokenId: '22', nftName: 'wimpyGuard #1234', ...statsMap.wimpyGuard },
    }
}


export const initialGameState: Gamestate = {
    scene: initialEntryState,
    ownedCharacters: initialOwnedCharacters(),
    inventory: {},
    events: [],
}
