import type { Gamestate, OwnedCharacter } from '@shared'

import { getRulebook } from '@/rulebook'
import { keys, vals } from '@/util'
import { getRulebookNames, stringifyRulebook } from '@/util'

import { initialEntryState } from './entry/state'

const NUM_OF_EACH_CHAR = 5

const config = {
    includeRulebook: true,
}

export function initialOwnedCharacters(): Record<string, OwnedCharacter> {

    const { characters: statsMap } = getRulebook()

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


export function getInitialGameState(): Gamestate {
    return {
        scene: initialEntryState,
        ownedCharacters: initialOwnedCharacters(),
        inventory: {},
        events: { world: [], move: [] },
        rulebooks: config.includeRulebook ? getRulebookNames() : undefined,
        curRulebook: config.includeRulebook ? stringifyRulebook(getRulebook()) : undefined,
    }
}
