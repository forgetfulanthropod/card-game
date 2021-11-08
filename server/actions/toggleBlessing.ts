import type { ToggleBlessing } from '@shared'
import { findIndex } from 'lodash'

import { blessingsMap } from '@/rulebook/blessingsMap'
import { commit, getGameStateCursor } from '@/util'

export const toggleBlessing: ToggleBlessing = (args) => {
    const gameState = getGameStateCursor('alice')
    gameState.apply('blessings', blessings => {
        const i = findIndex(blessings, { name: args.name })
        if (i === -1) {
            return [...blessings, blessingsMap[args.name]]
        }
        return drop(blessings, i)
    })
    commit(gameState)
}

function drop<T>(arr: T[], i: number): T[] {
    return [...arr.slice(0, i), ...arr.slice(i + 1)]
}
