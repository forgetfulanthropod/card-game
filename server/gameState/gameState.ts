import type { Gamestate, OwnedCharacter } from '@shared'

import { statsMap } from '@/rulebook/battle'
import { keys, vals } from '@/util'

import { initialEntryState } from './entry/state'

const NUM_OF_EACH_CHAR = 5

export function initialOwnedCharacters(): Record<string, OwnedCharacter> {
    const oc: Record<string, OwnedCharacter> = {}
    const characterIds = keys(statsMap)
    vals(statsMap).forEach((c, i) => {
        for (let j = 0; j < NUM_OF_EACH_CHAR; j++) {
            const uid = `${characterIds[i]}-${j}`
            oc[uid] = { uid, tokenId: j.toString(), nftName: uid, ...c }
        }
    })

    return oc
}


export const initialGameState: Gamestate = {
    scene: initialEntryState,
    ownedCharacters: initialOwnedCharacters(),
    inventory: {},
    events: { world: [], move: [] },
}
