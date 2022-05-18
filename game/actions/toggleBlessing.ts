import type { GameActions } from '@serverActions'
import { findIndex, values } from 'lodash'
import type { BlessingName } from 'shared'

import { getModified } from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import { getBattleSceneIn } from '@/util'

export const toggleBlessing: GameActions['ToggleBlessing'] = args => {
    const name = args.name as BlessingName
    const { blessings: blessingsMap } = getRulebook()
    args.game.apply('blessings', blessings => {
        const i = findIndex(blessings, { name: name })
        if (i === -1) {
            return [...blessings, blessingsMap[name]]
        }
        return drop(blessings, i)
    })

    if (args.game.get('scene', 'name') === 'battle') {
        const allCharactersCursor = getBattleSceneIn(args.game).select(
            'allCharacters'
        )
        for (const cm of values(allCharactersCursor.get())) {
            allCharactersCursor.set(
                cm.uid,
                getModified(args.game.get('blessings'), cm)
            )
        }
    }
}

function drop<T>(arr: T[], i: number): T[] {
    return [...arr.slice(0, i), ...arr.slice(i + 1)]
}
