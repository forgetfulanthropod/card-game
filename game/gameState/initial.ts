import type { CharacterUid, Gamestate, OwnedCharacterStatsMap } from 'shared'
import { keys, vals } from 'shared/code'
import { getInitialEntryState } from './entryState'
import { getRulebook } from '@/rulebook'
import { getRulebookNames, stringifyRulebook } from '@/util'

const NUM_OF_EACH_CHAR = 5
const config = {
    includeRulebook: true,
}
function initialOwnedCharacters(): OwnedCharacterStatsMap {
    const { characters: statsMap } = getRulebook()

    let oc = {} as OwnedCharacterStatsMap
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
        scene: getInitialEntryState(),
        ownedCharacters: initialOwnedCharacters(),
        events: { world$: [], move$: [], DOT$: [] },
        rulebooks: config.includeRulebook ? getRulebookNames() : undefined,
        curRulebook: config.includeRulebook
            ? stringifyRulebook(getRulebook())
            : undefined,
        username,
        nextAction: null,
    }
}
