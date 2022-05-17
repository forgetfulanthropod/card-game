import type { CharacterUid, Gamestate, OwnedCharacterStatsMap } from 'shared'

import { getRulebook } from '@/rulebook'
import { keys, vals } from '@/util'
import { getRulebookNames, stringifyRulebook } from '@/util'

import { initialEntryState } from './entry/state'

const NUM_OF_EACH_CHAR = 5

const config = {
    includeRulebook: true,
}

function initialOwnedCharacters(): OwnedCharacterStatsMap {
    const { characters: statsMap } = getRulebook()

    let oc: OwnedCharacterStatsMap = {}
    const characterIds = keys(statsMap)
    vals(statsMap).forEach((c, i) => {
        for (let j = 0; j < NUM_OF_EACH_CHAR; j++) {
            const uid = `${characterIds[i]}-${j}` as CharacterUid
            oc = {
                ...oc,
                [uid]: {
                    ...c,
                    uid,
                    tokenId: j.toString(),
                    nftName: uid,
                    isPc: true,
                },
            }
        }
    })

    return oc as OwnedCharacterStatsMap
}

export function getInitialGameState(username: string): Gamestate {
    return {
        scene: initialEntryState,
        ownedCharacters: initialOwnedCharacters(),
        inventory: {},
        coin: 99,
        blessings: [],
        events: { world$: [], move$: [], DOT$: [] },
        rulebooks: config.includeRulebook ? getRulebookNames() : undefined,
        curRulebook: config.includeRulebook
            ? stringifyRulebook(getRulebook())
            : undefined,
        username,
    }
}
