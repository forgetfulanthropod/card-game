import type { ToggleBlessing } from '@serverActions'
import { findIndex, values } from 'lodash'
import type { BlessingName } from 'shared'

import { getModified } from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import { getBattleScene, getGameStateCursor } from '@/util'

export const toggleBlessing: ToggleBlessing = args => {
    const name = args.name as BlessingName
    const { blessings: blessingsMap } = getRulebook()
    const gameState = getGameStateCursor(args.username)
    gameState.apply('blessings', blessings => {
        const i = findIndex(blessings, { name: name })
        if (i === -1) {
            return [...blessings, blessingsMap[name]]
        }
        return drop(blessings, i)
    })

    if (
        getGameStateCursor(args.username).select('scene').get('name') ===
        'battle'
    ) {
        const allCharactersCursor = getBattleScene(args.username).select(
            'allCharacters'
        )
        for (const cm of values(allCharactersCursor.get())) {
            allCharactersCursor.set(cm.uid, getModified(cm, args.username))
        }
    }
}

function drop<T>(arr: T[], i: number): T[] {
    return [...arr.slice(0, i), ...arr.slice(i + 1)]
}
