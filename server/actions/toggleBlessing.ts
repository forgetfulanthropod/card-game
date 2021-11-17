import type { ToggleBlessing } from '@serverActions'
import { findIndex, values } from 'lodash'

import { getModified } from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import { commit, getBattleScene, getGameStateCursor } from '@/util'

export const toggleBlessing: ToggleBlessing = (args) => {
    const { blessings: blessingsMap } = getRulebook()
    const gameState = getGameStateCursor('alice')
    gameState.apply('blessings', blessings => {
        const i = findIndex(blessings, { name: args.name })
        if (i === -1) {
            return [...blessings, blessingsMap[args.name]]
        }
        return drop(blessings, i)
    })

    if (getGameStateCursor('alice').select('scene').get('name') === 'battle') {
        const allCharactersCursor = getBattleScene('alice').select('allCharacters')
        for (const cm of values(allCharactersCursor.get())) {
            allCharactersCursor.set(cm.uid, getModified(cm))
        }
    }
    commit(gameState)
}

function drop<T>(arr: T[], i: number): T[] {
    return [...arr.slice(0, i), ...arr.slice(i + 1)]
}
